from django.contrib import admin
from apps.album.models import AlbumFile, Album

# Register your models here.

admin.site.register(AlbumFile)
admin.site.register(Album)
