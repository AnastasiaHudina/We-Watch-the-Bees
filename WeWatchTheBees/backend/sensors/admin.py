from django.contrib import admin

from .models import Alert, Sensor, SensorReading


class SensorReadingInline(admin.TabularInline):
    model = SensorReading
    extra = 0
    readonly_fields = ("timestamp",)
    ordering = ("-timestamp",)


@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ("id", "device_id", "sensor_type", "hive")
    list_filter = ("sensor_type",)
    search_fields = ("device_id", "hive__name")
    inlines = [SensorReadingInline]


@admin.register(SensorReading)
class SensorReadingAdmin(admin.ModelAdmin):
    list_display = ("id", "sensor", "value", "timestamp")
    list_filter = ("sensor__sensor_type",)
    ordering = ("-timestamp",)


@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ("id", "hive", "severity", "sensor_type", "status", "timestamp")
    list_filter = ("severity", "status", "sensor_type")
    ordering = ("-timestamp",)
