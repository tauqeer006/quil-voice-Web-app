from django.urls import path
from .views import VoiceSessionView

urlpatterns = [
    path("voice/session/", VoiceSessionView.as_view(), name="voice-session"),
]
