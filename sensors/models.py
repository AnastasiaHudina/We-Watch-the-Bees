from django.conf import settings
from django.db import models

from apiary.models import Hive


class Sensor(models.Model):
    SENSOR_TYPES = [
        ("weight", "weight"),
        ("temp", "temp"),
        ("hum", "hum"),
    ]

    hive = models.ForeignKey(Hive, on_delete=models.CASCADE, related_name="sensors")
    sensor_type = models.CharField(max_length=10, choices=SENSOR_TYPES)
    device_id = models.CharField(max_length=80, unique=True)

    def __str__(self) -> str:
        return f"{self.device_id} ({self.sensor_type})"


class SensorReading(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name="readings")
    value = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.sensor.device_id}: {self.value} @ {self.timestamp}"


class Alert(models.Model):
    STATUS_CHOICES = [
        ("new", "new"),
        ("read", "read"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="alerts")
    hive = models.ForeignKey(Hive, on_delete=models.CASCADE, related_name="alerts")
    message = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="new")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"[{self.status}] {self.message}"

