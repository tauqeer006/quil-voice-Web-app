from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from common.mongo import documents_col
from common.serializers import to_json_safe
from apps.ai_gateway.client import ai_request


class DocumentListView(APIView):
    """Document library: list of uploaded docs for the caller's org."""

    def get(self, request):
        org_id = ObjectId(request.user.organization_id)
        docs = list(documents_col().find({"organization_id": org_id}).sort("uploaded_at", -1))
        return Response([to_json_safe(d) for d in docs])


class DocumentUploadView(APIView):
    """
    Accepts a file upload (PDF/DOCX/TXT/image) or a `source_url`, and
    forwards it to the AI side's ingestion endpoint. The AI side owns
    chunking/embedding and reports status back via documents.status.
    """

    def post(self, request):
        source_url = request.data.get("source_url")
        file_obj = request.FILES.get("file")

        if not source_url and not file_obj:
            return Response(
                {"detail": "Provide either a file or a source_url."}, status=status.HTTP_400_BAD_REQUEST
            )

        common_fields = {
            "organization_id": request.user.organization_id,
            "uploaded_by": request.user.id,
        }

        if source_url:
            resp = ai_request(
                "POST", "/documents/ingest", json={**common_fields, "source_type": "url", "source_url": source_url}
            )
        else:
            files = {"file": (file_obj.name, file_obj.read(), file_obj.content_type)}
            resp = ai_request("POST", "/documents/ingest", data=common_fields, files=files)

        return Response(resp.json(), status=resp.status_code)


class DocumentDetailView(APIView):
    def get(self, request, doc_id):
        org_id = ObjectId(request.user.organization_id)
        doc = documents_col().find_one({"_id": ObjectId(doc_id), "organization_id": org_id})
        if not doc:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(to_json_safe(doc))

    def delete(self, request, doc_id):
        org_id = ObjectId(request.user.organization_id)
        result = documents_col().delete_one({"_id": ObjectId(doc_id), "organization_id": org_id})
        if result.deleted_count == 0:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
