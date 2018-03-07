from django.urls import path

from apps.index import views

urlpatterns = [
    path('index/', views.index_view, name='index'),
]