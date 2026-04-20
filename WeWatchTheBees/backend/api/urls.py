from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('user/', views.CurrentUserView.as_view()),
    path('user/update/', views.UserUpdateView.as_view()),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('register/', views.RegisterView.as_view()),

    # Hives
    path('hives/', views.HiveListCreateView.as_view()),
    path('hives/<int:pk>/', views.HiveDetailView.as_view()),
    path('hives/<int:pk>/update/', views.HiveUpdateView.as_view()),
    path('hives/<int:pk>/delete/', views.HiveDeleteView.as_view()),

    # Sensors
    path('sensors/<int:sensor_id>/last/', views.LastSensorReadingView.as_view()),
    path('sensors/<int:sensor_id>/readings/', views.SensorReadingsView.as_view()),
]