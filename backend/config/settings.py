import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "insecure-dev-key")
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "apps.users",
    "apps.organizations",
    "apps.documents",
    "apps.superadmin",
    "apps.ai_gateway",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {"context_processors": []},
    }
]

# We use MongoDB directly via pymongo (see common/mongo.py) instead of the
# Django ORM. A local sqlite db is kept only to satisfy Django internals
# (sessions/admin are unused).
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "common.auth.MongoJWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "UNAUTHENTICATED_USER": None,
}

JWT_SECRET = os.getenv("DJANGO_SECRET_KEY", "insecure-dev-key")
JWT_ACCESS_TOKEN_HOURS = 12

CORS_ALLOW_ALL_ORIGINS = DEBUG

# --- Mongo config (all names from .env, nothing hardcoded) ---
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "voice_rag_platform")
USERS_COLLECTION = os.getenv("USERS_COLLECTION", "users")
ORGANIZATIONS_COLLECTION = os.getenv("ORGANIZATIONS_COLLECTION", "organizations")
DOCUMENTS_COLLECTION = os.getenv("DOCUMENTS_COLLECTION", "documents")
EMBEDDINGS_COLLECTION_PREFIX = os.getenv("EMBEDDINGS_COLLECTION_PREFIX", "embeddings_")
AI_TOKENS_COLLECTION = os.getenv("AI_TOKENS_COLLECTION", "ai_tokens")
CALL_SESSIONS_COLLECTION = os.getenv("CALL_SESSIONS_COLLECTION", "call_sessions")

# --- AI side service-to-service config ---
AI_SERVICE_BASE_URL = os.getenv("AI_SERVICE_BASE_URL", "http://localhost:8001")
AI_SERVICE_SECRET = os.getenv("AI_SERVICE_SECRET", "change-me-shared-secret")
TOKEN_EXPIRY_MINUTES = int(os.getenv("TOKEN_EXPIRY_MINUTES", "15"))

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
