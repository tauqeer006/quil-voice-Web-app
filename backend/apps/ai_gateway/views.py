from rest_framework.views import APIView
from rest_framework.response import Response

from .client import ai_request


class VoiceSessionView(APIView):
    """
    Frontend never talks to the AI side directly (per spec). This asks the
    AI side to open a voice session and hands back a ws:// url + session id
    the frontend can connect to directly for the actual audio stream.
    """

    def post(self, request):
        resp = ai_request(
            "POST",
            "/voice/session",
            json={"organization_id": request.user.organization_id, "user_id": request.user.id},
        )
        return Response(resp.json(), status=resp.status_code)
