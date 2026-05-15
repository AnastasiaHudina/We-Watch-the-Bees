from __future__ import annotations

from sensors.models import Alert, Sensor, SensorReading
from sensors.thresholds import build_alert_message, evaluate_level, level_to_severity


def check_and_create_alert(sensor: Sensor, value: float, current_reading: SensorReading) -> Alert | None:
    """
    Создаёт оповещение при переходе показания в более высокий уровень опасности
    (норма → предупреждение, норма → критично, предупреждение → критично).
    Повторные показания того же уровня не дублируются.
    """
    current_level = evaluate_level(sensor.sensor_type, value)
    if current_level == 0:
        return None

    previous = (
        sensor.readings.exclude(pk=current_reading.pk).order_by("-timestamp").first()
    )
    previous_level = evaluate_level(sensor.sensor_type, previous.value) if previous else 0

    if current_level <= previous_level:
        return None

    hive = sensor.hive
    user = hive.apiary.user
    severity = level_to_severity(current_level)
    message = build_alert_message(hive.name, sensor.sensor_type, value, current_level)

    return Alert.objects.create(
        user=user,
        hive=hive,
        message=message,
        severity=severity,
        sensor_type=sensor.sensor_type,
        status="new",
    )
