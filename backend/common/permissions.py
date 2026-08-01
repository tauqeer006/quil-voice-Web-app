from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, "role", None) == "superadmin"


class IsOrgAdmin(BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, "role", None) in ("org_admin", "superadmin")


class IsSameOrgOrSuperAdmin(BasePermission):
    """Scopes access to the caller's own organization unless superadmin."""

    def has_permission(self, request, view):
        return bool(getattr(request.user, "organization_id", None)) or \
            getattr(request.user, "role", None) == "superadmin"
