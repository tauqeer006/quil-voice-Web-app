from django.urls import path
from .views import MyOrganizationView, CreditsView

urlpatterns = [
    path("me/", MyOrganizationView.as_view(), name="org-me"),
    path("credits/", CreditsView.as_view(), name="org-credits"),
]
