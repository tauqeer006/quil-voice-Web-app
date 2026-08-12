import React, { useRef, useState } from "react";
import Layout from "../components/Layout.jsx";
import { voice } from "../api/client";

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.9c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function PhoneOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-3.4 0-6.6-.9-9.4-2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M3 4c0-.6.4-1 1-1h3.9c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-1.2 1.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M3 11.5 20.5 3 13 20.5l-2.4-7.1L3 11.5Z" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="20" y1="20" x2="15.2" y2="15.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SentTick() {
  return (
    <svg viewBox="0 0 16 12" width="14" height="10" fill="none" aria-hidden="true">
      <path d="M1 6.5 4.5 10 11 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function VoiceAgent() {
  const [inCall, setInCall] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [message, setMessage] = useState("");
  const [microphoneStatus, setMicrophoneStatus] = useState("idle");
  const [error, setError] = useState("");
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);

  async function startMicrophone(ws) {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Microphone access is not supported in this browser.");
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;

    let recorder;
    const options = { mimeType: "audio/webm" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      delete options.mimeType;
    }

    recorder = new MediaRecorder(stream, options);
    recorder.ondataavailable = async (event) => {
      if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
        try {
          const blob = event.data;
          console.info("Sending audio chunk", blob.size, blob.type);
          ws.send(blob);
        } catch (sendError) {
          console.warn("Failed to send audio chunk", sendError);
        }
      }
    };
    recorder.onstart = () => setMicrophoneStatus("recording");
    recorder.onstop = () => setMicrophoneStatus("stopped");
    recorder.onerror = (event) => setError(`Microphone error: ${event.error?.message || "unknown"}`);

    recorder.start(250);
    mediaRecorderRef.current = recorder;
  }

  function stopMicrophone() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    mediaRecorderRef.current = null;
    setMicrophoneStatus("idle");
  }

  async function startCall() {
    setError("");
    const session = await voice.openSession();
    const wsBase = import.meta.env.VITE_AI_WS_URL || "ws://localhost:8001";
    const ws = new WebSocket(
      `${wsBase}${session.ws_url}?token=${encodeURIComponent(session.token)}`
    );
    ws.binaryType = "arraybuffer";

    ws.onmessage = async (event) => {
      if (typeof event.data === "string") {
        try {
          const msg = JSON.parse(event.data);
          setTranscript((t) => [...t, { role: "agent", text: msg.text, time: new Date() }]);
        } catch {
          console.warn("Received text event that is not JSON", event.data);
        }
      } else {
        const blob = event.data instanceof Blob ? event.data : new Blob([event.data]);
        const audio = new Audio(URL.createObjectURL(blob));
        await audio.play().catch((err) => console.warn("Audio play failed", err));
      }
    };

    ws.onopen = async () => {
      console.info("Voice WS opened", ws.url);
      setInCall(true);
      try {
        await startMicrophone(ws);
      } catch (err) {
        setError(err.message || "Microphone permission denied.");
      }
    };

    ws.onclose = (event) => {
      console.info("Voice WS closed", event.code, event.reason, event.wasClean);
      setInCall(false);
      stopMicrophone();
    };

    ws.onerror = (event) => {
      console.warn("Voice WS error", event);
      setInCall(false);
      stopMicrophone();
      setError("WebSocket error occurred.");
    };

    wsRef.current = ws;
  }

  function endCall() {
    stopMicrophone();
    wsRef.current?.close();
    setInCall(false);
  }

  function sendTextTurn(text) {
    if (!text.trim() || !wsRef.current) return;
    setTranscript((t) => [...t, { role: "user", text: text.trim(), time: new Date() }]);
    wsRef.current.send(JSON.stringify({ text: text.trim() }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!message.trim()) return;
    sendTextTurn(message);
    setMessage("");
  }

  const lastPreview = transcript.length ? transcript[transcript.length - 1].text : "Tap to start a call";

  return (
    <Layout>
      <div className="voice-page">
        <aside className="voice-sidebar card">
          <div className="voice-sidebar-header">
            <h2>Chats</h2>
          </div>

          <div className="wa-search">
            <SearchIcon />
            <input type="text" placeholder="Search or start new chat" disabled />
          </div>

          <div className="wa-chat-list">
            <div className="wa-chat-item active">
              <div className="wa-avatar">
                <span>V</span>
                <span className={`wa-avatar-status ${inCall ? "online" : "offline"}`} />
              </div>
              <div className="wa-chat-item-body">
                <div className="wa-chat-item-top">
                  <span className="wa-chat-item-name">Voice Agent</span>
                  {transcript.length > 0 && (
                    <span className="wa-chat-item-time">{formatTime(transcript[transcript.length - 1].time)}</span>
                  )}
                </div>
                <p className="wa-chat-item-preview">{inCall ? "Call in progress…" : lastPreview}</p>
              </div>
            </div>
          </div>

          <div className="voice-info-card">
            <p className="voice-info-title">How it works</p>
            <p>
              When a call starts, the agent opens a live session. Type in the chat bar and the agent will reply in real time.
            </p>
          </div>
        </aside>

        <section className="voice-main card">
          <header className="wa-chat-header">
            <div className="wa-header-identity">
              <div className="wa-avatar wa-avatar-lg">
                <span>V</span>
                <span className={`wa-avatar-status ${inCall ? "online" : "offline"}`} />
              </div>
              <div>
                <h1 className="wa-header-name">Voice Agent</h1>
                <p className="wa-header-status">
                  {inCall ? "In call · you can type messages" : "Offline · start a call to chat"}
                </p>
              </div>
            </div>

            <button
              type="button"
              className={`wa-call-btn ${inCall ? "active" : ""}`}
              onClick={inCall ? endCall : startCall}
              aria-label={inCall ? "End call" : "Start call"}
              title={inCall ? "End call" : "Start call"}
            >
              {inCall ? <PhoneOffIcon /> : <PhoneIcon />}
            </button>
          </header>

          {error && <div className="error-message" style={{ margin: "0 20px" }}>{error}</div>}
          <div className="voice-status-summary" style={{ margin: "0 20px", color: "var(--wa-text-muted)" }}>
            {inCall
              ? microphoneStatus === "recording"
                ? "Microphone is live. Speak now and your audio will stream to the AI service."
                : "Call is active. Waiting for microphone capture to start..."
              : "Start a call to send audio from your mic and receive agent responses."}
          </div>

          <div className="chat-window">
            {transcript.length === 0 ? (
              <div className="chat-empty">
                <p>No messages yet.</p>
                <p>Start the call to begin talking with the agent.</p>
              </div>
            ) : (
              transcript.map((t, i) => (
                <div key={i} className={`chat-bubble ${t.role}`}>
                  <div className="message-text">{t.text}</div>
                  <div className="wa-bubble-meta">
                    <span className="wa-bubble-time">{formatTime(t.time)}</span>
                    {t.role === "user" && <SentTick />}
                  </div>
                </div>
              ))
            )}
          </div>

          <form className="chat-input-bar" onSubmit={handleSubmit}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={inCall ? "Type a message…" : "Start the call to chat with the agent"}
              disabled={!inCall}
            />
            <button type="submit" className="wa-send-btn" disabled={!inCall || !message.trim()} aria-label="Send">
              <SendIcon />
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
}
