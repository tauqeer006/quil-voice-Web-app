from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from common.mongo import organizations_col, documents_col, call_sessions_col
from common.serializers import to_json_safe


class MyOrganizationView(APIView):
    """Dashboard overview: org profile + doc count + credits + recent calls."""

    def get(self, request):
        org_id = ObjectId(request.user.organization_id)
        org = organizations_col().find_one({"_id": org_id})
        if not org:
            return Response({"detail": "Organization not found."}, status=status.HTTP_404_NOT_FOUND)

        recent_calls = list(
            call_sessions_col().find({"organization_id": org_id}).sort("started_at", -1).limit(5)
        )
        doc_count = documents_col().count_documents({"organization_id": org_id})

        payload = to_json_safe(org)
        payload["document_count"] = doc_count
        payload["recent_calls"] = [to_json_safe(c) for c in recent_calls]
        return Response(payload)


class CreditsView(APIView):
    def get(self, request):
        org_id = ObjectId(request.user.organization_id)
        org = organizations_col().find_one(
            {"_id": org_id}, {"credits_total": 1, "credits_used": 1}
        )
        if not org:
            return Response({"detail": "Organization not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(to_json_safe(org))
