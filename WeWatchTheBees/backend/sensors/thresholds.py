"""Пороги оповещений — согласованы с цветовой индикацией на главной странице."""

from __future__ import annotations

from typing import Literal

Level = Literal[0, 1, 2]  # 0 — норма, 1 — предупреждение, 2 — критично
Severity = Literal["warning", "critical"]

SENSOR_LABELS = {
    "temp": "температура",
    "hum": "влажность",
    "weight": "вес",
}

SENSOR_UNITS = {
    "temp": "°C",
    "hum": "%",
    "weight": "кг",
}


def evaluate_level(sensor_type: str, value: float) -> Level:
    if sensor_type == "temp":
        if value >= 38 or value < 20:
            return 2
        if value >= 32:
            return 1
        return 0

    if sensor_type == "hum":
        if value >= 85 or value <= 25:
            return 2
        if value >= 75 or value <= 35:
            return 1
        return 0

    if sensor_type == "weight":
        if value <= 35 or value >= 65:
            return 2
        if value <= 40 or value >= 60:
            return 1
        return 0

    return 0


def level_to_severity(level: Level) -> Severity:
    return "critical" if level == 2 else "warning"


def build_alert_message(hive_name: str, sensor_type: str, value: float, level: Level) -> str:
    label = SENSOR_LABELS.get(sensor_type, sensor_type)
    unit = SENSOR_UNITS.get(sensor_type, "")
    formatted = f"{value:.1f}{unit}"

    if level == 2:
        return f"Критическое отклонение: улей «{hive_name}» — {label} {formatted}"
    return f"Предупреждение: улей «{hive_name}» — {label} {formatted}"
