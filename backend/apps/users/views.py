from datetime import datetime, timezone

import bcrypt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from common.mongo import users_col, organizations_col
from common.serializers import to_json_safe
from common.auth import issue_token


class SignupView(APIView):
    """Registers a brand new organization + its first org_admin user."""
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        org_name = data.get("organization_name")
        email = data.get("email")
        password = data.get("password")

        if not all([org_name, email, password]):
            return Response(
                {"detail": "organization_name, email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if users_col().find_one({"email": email}):
            return Response({"detail": "Email already registered."}, status=status.HTTP_409_CONFLICT)

        org_doc = {
            "name": org_name,
            "created_at": datetime.now(timezone.utc),
            "status": "active",
            "credits_total": 1000,
            "credits_used": 0,
            "document_count": 0,
        }
        org_id = organizations_col().insert_one(org_doc).inserted_id

        password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        user_doc = {
            "organization_id": org_id,
            "email": email,
            "password_hash": password_hash,
            "role": "org_admin",
            "created_at": datetime.now(timezone.utc),
            "last_login": None,
        }
        user_id = users_col().insert_one(user_doc).inserted_id
        user_doc["_id"] = user_id

        token = issue_token(user_doc)
        return Response(
            {"token": token, "user": to_json_safe(user_doc)},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user_doc = users_col().find_one({"email": email})

        if not user_doc or not bcrypt.checkpw(password.encode(), user_doc["password_hash"].encode()):
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        users_col().update_one({"_id": user_doc["_id"]}, {"$set": {"last_login": datetime.now(timezone.utc)}})
        token = issue_token(user_doc)
        return Response({"token": token, "user": to_json_safe(user_doc)})


class MeView(APIView):
    def get(self, request):
        return Response(to_json_safe(request.user.doc))

