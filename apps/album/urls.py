from django.urls import path

from apps.album import views

urlpatterns = [
    path('album/', views.album_view, name='album'),
    path('albumLoad/', views.albumupload_view, name='album-upload'),
    path('albumfile/search/', views.searchOwnerTitle),
    path('albumfile/create/', views.createOwnerTitle),
]