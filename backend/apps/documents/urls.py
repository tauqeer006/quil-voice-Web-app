from django.urls import path
from .views import DocumentUploadView, DocumentListView, DocumentDetailView

urlpatterns = [
    path("", DocumentListView.as_view(), name="document-list"),
    path("upload/", DocumentUploadView.as_view(), name="document-upload"),
    path("<str:doc_id>/", DocumentDetailView.as_view(), name="document-detail"),
]
