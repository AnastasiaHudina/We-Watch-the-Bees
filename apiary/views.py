from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from .models import Apiary


@login_required
def my_apiary(request):
    apiary, _ = Apiary.objects.get_or_create(
        user=request.user, defaults={"name": f"Пасека {request.user.username}"}
    )
    hives = apiary.hives.all().order_by("id")
    return render(request, "apiary/my_apiary.html", {"apiary": apiary, "hives": hives})

