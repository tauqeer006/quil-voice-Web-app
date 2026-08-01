from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from common.mongo import organizations_col, documents_col, call_sessions_col, users_col
from common.serializers import to_json_safe
from common.permissions import IsSuperAdmin


class OrganizationListView(APIView):
    """All orgs, with doc/credit summary — superadmin overview page."""
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        orgs = list(organizations_col().find())
        return Response([to_json_safe(o) for o in orgs])


class OrganizationDetailView(APIView):
    """Drill-down: users, documents, call history, credit ledger for one org."""
    permission_classes = [IsSuperAdmin]

    def get(self, request, org_id):
        oid = ObjectId(org_id)
        org = organizations_col().find_one({"_id": oid})
        if not org:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        payload = to_json_safe(org)
        payload["users"] = [to_json_safe(u) for u in users_col().find({"organization_id": oid})]
        payload["documents"] = [to_json_safe(d) for d in documents_col().find({"organization_id": oid})]
        payload["call_history"] = [
            to_json_safe(c) for c in call_sessions_col().find({"organization_id": oid}).sort("started_at", -1)
        ]
        return Response(payload)


class SuspendOrganizationView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, org_id):
        new_status = request.data.get("status", "suspended")
        if new_status not in ("active", "suspended"):
            return Response({"detail": "status must be 'active' or 'suspended'."}, status=status.HTTP_400_BAD_REQUEST)
        result = organizations_col().update_one({"_id": ObjectId(org_id)}, {"$set": {"status": new_status}})
        if result.matched_count == 0:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"status": new_status})
