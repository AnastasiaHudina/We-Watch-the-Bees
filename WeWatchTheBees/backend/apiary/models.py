from django.conf import settings
from django.db import models


class Apiary(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="apiary",
    )
    name = models.CharField(max_length=150)
    hive_id = models.CharField(max_length=50, blank=True, null=True, verbose_name="Идентификатор улья")
    bee_info = models.TextField(blank=True, null=True, verbose_name="Данные о пчелосемье")
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self) -> str:
        return self.name


class Hive(models.Model):
    apiary = models.ForeignKey(
        Apiary,
        on_delete=models.CASCADE,
        related_name="hives",
    )
    name = models.CharField(max_length=150)
    hive_id = models.CharField(max_length=50, blank=True, null=True)
    bee_info = models.TextField(blank=True, null=True)

    def __str__(self) -> str:
        return self.name

