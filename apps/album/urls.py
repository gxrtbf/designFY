from django.urls import path

from apps.album import views

urlpatterns = [
    path('album/', views.album_view, name='album'),
    path('albumItem/<str:title>/', views.albumitem_view, name='albumitem'),
    path('albumLoad/', views.albumupload_view, name='album-upload'),
    path('albumfile/search/', views.searchOwnerTitle_view),
    path('albumfile/create/', views.createOwnerTitle_view),
    path('albumfile/update/', views.updateOwnerTitle_view),
    path('albumfile/delete/', views.deleteOwnerTitle_view),
    path('albumitemlist/search/', views.searchAlbumList_view),
    path('albumitemlist/create/', views.createAlbumList_view),
    path('albumitemlist/delete/', views.deleteAlbumList_view),
]