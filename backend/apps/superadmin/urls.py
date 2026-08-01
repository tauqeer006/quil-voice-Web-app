from django.urls import path
from .views import OrganizationListView, OrganizationDetailView, SuspendOrganizationView

urlpatterns = [
    path("organizations/", OrganizationListView.as_view(), name="admin-org-list"),
    path("organizations/<str:org_id>/", OrganizationDetailView.as_view(), name="admin-org-detail"),
    path("organizations/<str:org_id>/suspend/", SuspendOrganizationView.as_view(), name="admin-org-suspend"),
]
