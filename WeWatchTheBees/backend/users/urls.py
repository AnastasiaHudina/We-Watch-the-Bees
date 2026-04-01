from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from . import views


app_name = "users"

urlpatterns = [
    path("", views.home, name="home"),
    path("accounts/register/", views.register, name="register"),
    path(
        "accounts/login/",
        LoginView.as_view(template_name="registration/login.html", redirect_authenticated_user=True),
        name="login",
    ),
    path("accounts/logout/", LogoutView.as_view(), name="logout"),
    path("knowledge/", views.knowledge_base, name="knowledge_base"),
    path("profile/", views.profile, name="profile"),
]

