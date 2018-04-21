from django.urls import path

from apps.note import views

urlpatterns = [
    path('note/', views.note_view, name='note'),
    path('note/compareface/', views.compareface_view),
]