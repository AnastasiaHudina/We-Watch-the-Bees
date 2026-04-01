from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("apiary", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Sensor",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                (
                    "sensor_type",
                    models.CharField(
                        choices=[("weight", "weight"), ("temp", "temp"), ("hum", "hum")],
                        max_length=10,
                    ),
                ),
                ("device_id", models.CharField(max_length=80, unique=True)),
                (
                    "hive",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="sensors",
                        to="apiary.hive",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="SensorReading",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("value", models.FloatField()),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "sensor",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="readings",
                        to="sensors.sensor",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Alert",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("message", models.CharField(max_length=255)),
                (
                    "status",
                    models.CharField(
                        choices=[("new", "new"), ("read", "read")],
                        default="new",
                        max_length=10,
                    ),
                ),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "hive",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="alerts",
                        to="apiary.hive",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="alerts",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]

