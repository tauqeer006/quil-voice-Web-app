# project-name-app

Frontend (React/Vite) + Backend (Django REST Framework) for the Multi-Tenant
Voice RAG Platform. Talks to `project-name-ai` for all AI/ML work.

## Structure

- `frontend/` — React SPA (landing, auth, dashboard, document upload/library,
  voice call UI, analytics, superadmin, settings)
- `backend/` — Django REST Framework API. Uses MongoDB directly via `pymongo`
  (see `backend/common/mongo.py`) rather than the Django ORM, since the data
  model is Mongo-native (see project root spec, section 3).

## Run locally

Backend:
```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
python manage.py runserver 8000
```

Frontend:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Both require a running MongoDB instance and the `project-name-ai` service
(see its own README) for uploads/RAG/voice to work end to end.

## Docker

Each service ships its own compose file for independent deployment:

```bash
docker network create platform_net   # once, shared by all 3 services
docker compose -f docker-compose.backend.yml up -d
docker compose -f docker-compose.frontend.yml up -d
# in project-name-ai: docker compose -f docker-compose.ai.yml up -d
```
# quil-voice-Web-app
