from django.shortcuts import render
from django.contrib.auth.models import User

from apps.album.serializers import AlbumSerializer, AlbumFileSerializer
from apps.album.models import Album, AlbumFile

# Create your views here.

def searchAlbumFile(self, request, key):
    albums = Album.objects.filter(title=key)
    serializer = AlbumSerializer(albums, many=True)
    return Response(serializer.data)

def searchOwner(self, request, key):
    albumfile = AlbumFile.objects.filter(owner=key)
    serializer = AlbumFileSerializer(albumfile, many=True)
    return Response(serializer.data)

def album_view(request):
	return render(request, 'album.html')

def albumupload_view(request):
	return render(request, 'albumupload.html')
