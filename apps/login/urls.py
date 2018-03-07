from django.urls import path

from apps.login import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
]