from django.conf import settings
from django.db import models


class Apiary(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="apiary",
    )
    name = models.CharField(max_length=150)
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

    def __str__(self) -> str:
        return self.name

