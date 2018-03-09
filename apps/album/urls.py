from django.urls import path
from django.conf.urls import url

from apps.album import views

urlpatterns = [
    path('album/', views.album_view, name='album'),
    path('albumItem/<int:key>/', views.albumitem_view, name='albumitem'),
    path('albumLoad/', views.albumupload_view, name='album-upload'),
    path('albumfile/search/', views.searchOwnerTitle_view),
    path('albumfile/create/', views.createOwnerTitle_view),
    path('albumitemlist/search/', views.searchAlbumList_view),
    path('albumitemlist/create/', views.createAlbumList_view),
]