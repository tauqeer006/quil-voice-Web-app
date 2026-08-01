from django.urls import path, include

urlpatterns = [
    path("api/auth/", include("apps.users.urls")),
    path("api/orgs/", include("apps.organizations.urls")),
    path("api/documents/", include("apps.documents.urls")),
    path("api/admin/", include("apps.superadmin.urls")),
    path("api/ai/", include("apps.ai_gateway.urls")),
]
