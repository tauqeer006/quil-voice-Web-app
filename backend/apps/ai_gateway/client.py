"""
Handles service-to-service auth + calls to the AI side (FastAPI).
Check-then-refresh pattern: cache the token in-process, request a new one
only once it's actually expired (or missing).
"""
import time
import requests
from django.conf import settings

_cached_token = {"value": None, "expires_at": 0}


def _fetch_new_token() -> str:
    resp = requests.post(
        f"{settings.AI_SERVICE_BASE_URL}/auth/token",
        json={"shared_secret": settings.AI_SERVICE_SECRET},
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()
    _cached_token["value"] = data["token"]
    # refresh a little early to avoid edge-of-expiry races
    _cached_token["expires_at"] = time.time() + (settings.TOKEN_EXPIRY_MINUTES * 60) - 30
    return _cached_token["value"]


def get_token() -> str:
    if _cached_token["value"] and time.time() < _cached_token["expires_at"]:
        return _cached_token["value"]
    return _fetch_new_token()


def ai_request(method: str, path: str, **kwargs) -> requests.Response:
    token = get_token()
    headers = kwargs.pop("headers", {})
    headers["Authorization"] = f"Bearer {token}"
    resp = requests.request(
        method, f"{settings.AI_SERVICE_BASE_URL}{path}", headers=headers, timeout=kwargs.pop("timeout", 30), **kwargs
    )
    if resp.status_code == 401:
        # token might have been revoked server-side; refresh once and retry
        headers["Authorization"] = f"Bearer {_fetch_new_token()}"
        resp = requests.request(method, f"{settings.AI_SERVICE_BASE_URL}{path}", headers=headers, timeout=30, **kwargs)
    return resp
