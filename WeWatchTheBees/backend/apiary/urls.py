from django.urls import path

from . import views


app_name = "apiary"

urlpatterns = [
    path("", views.my_apiary, name="my_apiary"),
]

