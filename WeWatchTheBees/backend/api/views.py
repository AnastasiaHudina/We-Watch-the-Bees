from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login, logout
from apiary.models import Hive
from sensors.models import Sensor, SensorReading
from .serializers import HiveSerializer, HiveCreateSerializer, SensorReadingSerializer, HiveUpdateSerializer, SensorSerializer
from users.forms import RegisterForm

# ---------- Пользователь ----------
class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
        })

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return Response({'success': True, 'username': user.username})
        return Response({'success': False, 'error': 'Неверные данные'}, status=400)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        logout(request)
        return Response({'success': True})

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        form = RegisterForm(request.data)
        if form.is_valid():
            user = form.save()
            login(request, user)          # автоматический вход после регистрации
            return Response({'success': True, 'username': user.username})
        return Response({'success': False, 'errors': form.errors}, status=400)

class UserUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data
        if 'username' in data:
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        user.save()
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
        })

# ---------- Ульи ----------
class HiveListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return HiveCreateSerializer
        return HiveSerializer

    def get_queryset(self):
        apiary = self.request.user.apiary
        return Hive.objects.filter(apiary=apiary).prefetch_related('sensors__readings')

    def perform_create(self, serializer):
        serializer.save(apiary=self.request.user.apiary)

class HiveDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = HiveSerializer

    def get_queryset(self):
        apiary = self.request.user.apiary
        return Hive.objects.filter(apiary=apiary).prefetch_related('sensors__readings')

class HiveDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Hive.objects.all()

    def get_queryset(self):
        return Hive.objects.filter(apiary=self.request.user.apiary)

class HiveUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = HiveUpdateSerializer
    queryset = Hive.objects.all()

    def get_queryset(self):
        return Hive.objects.filter(apiary=self.request.user.apiary)

# ---------- Показания ----------
class LastSensorReadingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, sensor_id):
        try:
            sensor = Sensor.objects.get(id=sensor_id, hive__apiary=request.user.apiary)
            reading = sensor.readings.order_by('-timestamp').first()
            if reading:
                return Response(SensorReadingSerializer(reading).data)
            return Response({'value': None, 'timestamp': None})
        except Sensor.DoesNotExist:
            return Response({'error': 'Датчик не найден'}, status=404)

class SensorReadingsView(generics.ListAPIView):
    serializer_class = SensorReadingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        sensor_id = self.kwargs['sensor_id']
        sensor = Sensor.objects.get(id=sensor_id, hive__apiary=self.request.user.apiary)
        from django.utils.timezone import now
        from datetime import timedelta
        return sensor.readings.filter(timestamp__gte=now() - timedelta(hours=24)).order_by('timestamp')

class SensorListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny] #[permissions.IsAuthenticated]
    serializer_class = SensorSerializer
    queryset = Sensor.objects.all()

@method_decorator(csrf_exempt, name='dispatch')
class SensorDataView(APIView):
    permission_classes = [permissions.AllowAny]  # для упрощения; в проде лучше ограничить

    def post(self, request):
        device_id = request.data.get('device_id')
        value = request.data.get('value')
        if not device_id or value is None:
            return Response({'error': 'device_id и value обязательны'}, status=400)
        try:
            sensor = Sensor.objects.get(device_id=device_id)
        except Sensor.DoesNotExist:
            return Response({'error': 'Датчик не найден'}, status=404)
        reading = SensorReading.objects.create(sensor=sensor, value=value)
        # Опционально: здесь можно добавить вызов функции проверки порогов для оповещений
        return Response({'status': 'ok', 'id': reading.id}, status=201)