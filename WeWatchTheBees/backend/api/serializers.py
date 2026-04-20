from rest_framework import serializers
from apiary.models import Hive
from sensors.models import Sensor, SensorReading

class SensorReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorReading
        fields = ['id', 'value', 'timestamp']

class SensorSerializer(serializers.ModelSerializer):
    last_reading = serializers.SerializerMethodField()

    class Meta:
        model = Sensor
        fields = ['id', 'sensor_type', 'device_id', 'last_reading']

    def get_last_reading(self, obj):
        reading = obj.readings.order_by('-timestamp').first()
        return SensorReadingSerializer(reading).data if reading else None

class HiveSerializer(serializers.ModelSerializer):
    sensors = SensorSerializer(many=True, read_only=True)

    class Meta:
        model = Hive
        fields = ['id', 'name', 'hive_id', 'bee_info', 'sensors']

class HiveCreateSerializer(serializers.ModelSerializer):
    sensor_types = serializers.ListField(child=serializers.CharField(), write_only=True)

    class Meta:
        model = Hive
        fields = ['id', 'name', 'hive_id', 'bee_info', 'sensor_types']

    def create(self, validated_data):
        sensor_types = validated_data.pop('sensor_types')
        hive = Hive.objects.create(**validated_data)
        for stype in sensor_types:
            Sensor.objects.create(
                hive=hive,
                sensor_type=stype,
                device_id=f"{hive.id}_{stype}_{hive.name}"
            )
        return hive


class HiveUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hive
        fields = ['name', 'hive_id', 'bee_info']
        extra_kwargs = {
            'name': {'required': True},
            'hive_id': {'required': False, 'allow_blank': True},
            'bee_info': {'required': False, 'allow_blank': True},
        }