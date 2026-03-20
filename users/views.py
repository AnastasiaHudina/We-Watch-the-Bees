from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from apiary.models import Apiary
from .forms import RegisterForm


def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("users:home")
    else:
        form = RegisterForm()

    return render(request, "registration/register.html", {"form": form})


@login_required
def home(request):
    # На случай, если сигнал не сработал для уже существующих пользователей.
    apiary, _ = Apiary.objects.get_or_create(
        user=request.user, defaults={"name": f"Пасека {request.user.username}"}
    )
    return render(request, "home.html", {"apiary": apiary})


@login_required
def knowledge_base(request):
    return render(request, "knowledge_base.html")


@login_required
def profile(request):
    return render(request, "profile.html")

