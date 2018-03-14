from django.urls import path

from apps.album import views

urlpatterns = [
    path('lovewords/', views.lovewords_view, name='lovewords'),
    path('lovecontent/', views.searchOwnerTitle_view, name='lovecontent'),
]