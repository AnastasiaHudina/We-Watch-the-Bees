from django.contrib import admin

from .models import Apiary, Hive


@admin.register(Apiary)
class ApiaryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "user", "location")
    list_filter = ("user",)
    search_fields = ("name", "user__username")


@admin.register(Hive)
class HiveAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "apiary", "hive_id")
    list_filter = ("apiary",)
    search_fields = ("name", "hive_id", "apiary__name")
