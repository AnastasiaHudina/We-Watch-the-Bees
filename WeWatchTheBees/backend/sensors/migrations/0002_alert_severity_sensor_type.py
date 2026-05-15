from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("sensors", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="alert",
            name="severity",
            field=models.CharField(
                choices=[("warning", "warning"), ("critical", "critical")],
                default="warning",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="alert",
            name="sensor_type",
            field=models.CharField(
                blank=True,
                choices=[("weight", "weight"), ("temp", "temp"), ("hum", "hum")],
                max_length=10,
            ),
        ),
        migrations.AlterModelOptions(
            name="alert",
            options={"ordering": ["-timestamp"]},
        ),
    ]
