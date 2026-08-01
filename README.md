# quil-voice AI

The AI engine powering **quil-voice** — a multi-tenant voice RAG platform. This service handles document ingestion, retrieval-augmented generation, and a real-time voice calling agent, orchestrated with **LangGraph** and served entirely through **local models** (no external LLM/STT/TTS API dependencies).

Built as the standalone AI microservice for the quil-voice platform. Frontend + backend live in a separate repo: [`quil-voice-app`](#).

---

## ✨ Features

- **Multi-format document ingestion** — PDF, DOCX, TXT, images (OCR), and live URLs (Selenium-based scraping)
- **Semantic-aware chunking** — recursive splitting with optional embedding-similarity-based semantic boundaries
- **Retrieval-Augmented Generation** — top-K vector search scoped per organization, powered by MongoDB vector search
- **Multi-agent orchestration** — LangGraph-based agent graph (routing → retrieval → synthesis → fallback), not a linear chain
- **Real-time voice agent** — local STT → LangGraph reasoning → local TTS, streamed over WebSocket
- **Fully local model stack** — no OpenAI/Anthropic API calls required at inference time; all model names and paths configured via `.env`
- **Service-to-service auth** — short-lived, DB-backed tokens for secure calls from the backend service
- **Multi-tenant by design** — every retrieval and ingestion operation is scoped to an `organization_id`

---

## 🏗️ Architecture

```
                ┌──────────────────────┐
   Backend  ───▶│   FastAPI Gateway     │
  (Django)      │   (token-authed)      │
                └──────────┬────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
     ┌────────▼────────┐      ┌─────────▼─────────┐
     │  Ingestion       │      │   Voice / RAG      │
     │  Pipeline        │      │   LangGraph Agent  │
     │  (loaders, OCR,  │      │   (router → rag →  │
     │  Selenium,       │      │   synthesis)        │
     │  splitter,       │      │                     │
     │  embeddings)     │      │  STT → LLM → TTS    │
     └────────┬────────┘      └─────────┬─────────┘
              │                         │
              └────────────┬────────────┘
                            │
                    ┌───────▼────────┐
                    │    MongoDB      │
                    │ (metadata +     │
                    │  vector search) │
                    └─────────────────┘
```

---

## 🧠 Local Model Stack

All models run locally — no data leaves the deployment environment.

| Component | Model | Notes |
|---|---|---|
| LLM | Qwen3 (8B–14B, configurable) | Served via Ollama / vLLM |
| STT | Faster-Whisper | Swappable with Moonshine/Parakeet for lower latency |
| TTS | Kokoro-82M | Swappable with Chatterbox Turbo for higher expressiveness |
| Embeddings | BGE / nomic-embed-text | Served via Ollama or sentence-transformers |

Model names, paths, and endpoints are never hardcoded — everything is read from environment variables at startup.

---

## 📂 Project Structure

```
quil-voice-ai/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── documents.py       # ingestion endpoints
│   │   ├── voice.py           # voice call session endpoints
│   │   ├── rag.py             # retrieval endpoints
│   │   └── auth.py            # token issuance/validation
│   ├── agents/
│   │   ├── graph.py            # LangGraph agent definition
│   │   ├── router_agent.py
│   │   ├── rag_agent.py
│   │   └── voice_prompt.py     # spoken-response system instructions
│   ├── ingestion/
│   │   ├── splitter.py
│   │   ├── pdf_loader.py
│   │   ├── docx_loader.py
│   │   ├── url_scraper.py      # Selenium-based scraping
│   │   └── ocr.py
│   ├── voice/
│   │   ├── stt.py
│   │   └── tts.py
│   ├── db/
│   │   ├── mongo_client.py
│   │   └── vector_store.py
│   └── core/
│       ├── config.py           # env-driven configuration
│       └── security.py         # service token handling
├── requirements.txt
├── Dockerfile
├── docker-compose.ai.yml
└── .env.example
```

---

## ⚙️ Setup

### Prerequisites
- Python 3.11+
- MongoDB instance (local or Atlas, with vector search enabled)
- [Ollama](https://ollama.com) or equivalent local model server
- Chrome/Chromium + ChromeDriver (for Selenium-based URL ingestion)
- Tesseract OCR installed on the host (or use the Docker image, which includes it)

### 1. Clone
```bash
git clone https://github.com/<your-username>/quil-voice-ai.git
cd quil-voice-ai
```

### 2. Configure environment
```bash
cp .env.example .env
# fill in MongoDB URL, model names, chunking config, and service secret
```

### 3. Install dependencies
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Run locally
```bash
uvicorn app.main:app --reload --port 8001
```

### 5. Run with Docker
```bash
docker compose -f docker-compose.ai.yml up --build
```

---

## 🔑 Environment Variables

See `.env.example` for the full list. Key groups:

- **MongoDB** — connection URL, database name, collection names
- **Chunking** — `CHUNK_SIZE`, `CHUNK_OVERLAP`, `USE_SEMANTIC_CHUNKING`
- **RAG** — `TOP_K`
- **Models** — `LLM_MODEL_NAME`, `STT_MODEL`, `TTS_MODEL`, `EMBEDDING_MODEL`, `OLLAMA_BASE_URL`
- **Auth** — `AI_SERVICE_SECRET`, `TOKEN_EXPIRY_MINUTES`

---

## 📡 API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/auth/token` | POST | Issue a short-lived service token |
| `/documents/upload` | POST | Ingest a document (PDF/DOCX/TXT/image) |
| `/documents/url` | POST | Ingest content from a URL via Selenium |
| `/rag/query` | POST | Run a retrieval + generation query (text) |
| `/voice/session` | WS | Open a real-time voice call session |

All endpoints (except `/auth/token`) require a valid bearer token issued by the auth endpoint.

---

## 🗺️ Roadmap

- [ ] Streaming token-by-token TTS for lower perceived latency
- [ ] Configurable agent graphs per organization
- [ ] Support for additional local embedding/LLM backends
- [ ] Usage-based credit metering per organization

---

## 👤 Author

**Tauqeer Ahmad**
AI Engineer

---

## 📄 License

MIT License — see `LICENSE` for details.