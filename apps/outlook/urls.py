from django.urls import path

from apps.outlook import views

urlpatterns = [
    path('outlook/', views.outlook_view, name='outlook'),
]