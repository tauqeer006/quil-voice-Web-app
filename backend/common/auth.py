"""
Custom lightweight JWT auth backed by Mongo `users` collection (org_admin |
member | superadmin). No Django ORM User model involved.
"""
import jwt
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from common.mongo import users_col


class MongoUser:
    """Thin wrapper so request.user behaves reasonably in views."""

    def __init__(self, doc: dict):
        self.doc = doc
        self.id = str(doc["_id"])
        self.organization_id = str(doc.get("organization_id")) if doc.get("organization_id") else None
        self.email = doc.get("email")
        self.role = doc.get("role", "member")
        self.is_authenticated = True

    def __getitem__(self, key):
        return self.doc[key]


def issue_token(user_doc: dict) -> str:
    payload = {
        "sub": str(user_doc["_id"]),
        "role": user_doc.get("role", "member"),
        "org_id": str(user_doc.get("organization_id")) if user_doc.get("organization_id") else None,
        "exp": datetime.now(timezone.utc) + timedelta(hours=settings.JWT_ACCESS_TOKEN_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


class MongoJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return None
        token = auth_header.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        user_doc = users_col().find_one({"_id": ObjectId(payload["sub"])})
        if not user_doc:
            raise AuthenticationFailed("User not found")
        return (MongoUser(user_doc), token)
