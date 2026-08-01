import React, { useRef, useState } from "react";
import Layout from "../components/Layout.jsx";
import { voice } from "../api/client";

export default function VoiceAgent() {
  const [inCall, setInCall] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const wsRef = useRef(null);

  async function startCall() {
    const session = await voice.openSession();
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const backendHost = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/^https?:\/\//, "").replace(/\/api$/, "");
    const ws = new WebSocket(`${wsProtocol}://${backendHost}${session.ws_url}`);

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        const msg = JSON.parse(event.data);
        setTranscript((t) => [...t, { role: "agent", text: msg.text }]);
      }
      // binary frames are TTS audio — hook up an <audio> player here once TTS is wired up
    };
    ws.onopen = () => setInCall(true);
    ws.onclose = () => setInCall(false);
    wsRef.current = ws;
  }

  function endCall() {
    wsRef.current?.close();
    setInCall(false);
  }

  function sendTextTurn(text) {
    if (!text || !wsRef.current) return;
    setTranscript((t) => [...t, { role: "user", text }]);
    wsRef.current.send(JSON.stringify({ text }));
  }

  return (
    <Layout>
      <h1>Voice Agent</h1>
      <div className="card voice-card">
        {inCall ? (
          <>
            <div className="pulse" />
            <button className="call-btn active" onClick={endCall}>End Call</button>
          </>
        ) : (
          <button className="call-btn" onClick={startCall}>Call Agent</button>
        )}

        {inCall && (
          <form
            className="voice-form"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.elements.turn;
              sendTextTurn(input.value);
              input.value = "";
            }}
          >
            <input name="turn" placeholder="(dev) type instead of speaking…" />
          </form>
        )}

        <div className="transcript">
          {transcript.map((t, i) => (
            <p key={i} className={t.role}><strong>{t.role === "user" ? "You" : "Agent"}:</strong> {t.text}</p>
          ))}
        </div>
      </div>
    </Layout>
  );
}
