"""
Single shared Mongo client + collection accessors. All names come from
Django settings (which itself reads from .env) — nothing is hardcoded.
"""
from functools import lru_cache
from pymongo import MongoClient
from django.conf import settings


@lru_cache(maxsize=1)
def get_client() -> MongoClient:
    return MongoClient(settings.MONGO_URL)


def get_db():
    return get_client()[settings.MONGO_DB_NAME]


def users_col():
    return get_db()[settings.USERS_COLLECTION]


def organizations_col():
    return get_db()[settings.ORGANIZATIONS_COLLECTION]


def documents_col():
    return get_db()[settings.DOCUMENTS_COLLECTION]


def ai_tokens_col():
    return get_db()[settings.AI_TOKENS_COLLECTION]


def call_sessions_col():
    return get_db()[settings.CALL_SESSIONS_COLLECTION]


def embeddings_col(org_slug: str):
    """Per-organization embeddings collection, e.g. embeddings_acme_corp."""
    return get_db()[f"{settings.EMBEDDINGS_COLLECTION_PREFIX}{org_slug}"]
