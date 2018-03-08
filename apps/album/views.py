from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework import status

from apps.album.serializers import AlbumSerializer, AlbumFileSerializer
from apps.album.models import Album, AlbumFile

# Create your views here.

def album_view(request):
	return render(request, 'album.html')

def albumupload_view(request):
	return render(request, 'albumupload.html')

@api_view(['POST'])
def searchOwnerTitle(request):
	if request.method == 'POST':
		owner = request.POST.get('owner', None)
		if owner:
			albumfile = AlbumFile.objects.filter(owner=owner)
			if albumfile:
				serializer = AlbumFileSerializer(albumfile, many=True)
				print(serializer.data)
				return Response(serializer.data)
			else:
				return JsonResponse({},status=403)
		else:
			return JsonResponse({'error': 'input error'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)
		
@api_view(['POST'])
def createOwnerTitle(request):
	if request.method == 'POST':
		owner = request.POST.get('owner', None)
		title = request.POST.get('title', None)
		if owner and title:
			user = User.objects.filter(id=owner)
			if user:
				albumfile = AlbumFile(owner=user[0], title=title)
				albumfile.save()
				return JsonResponse({'info': 'create success'}, status=200)
			else:
				return JsonResponse({'error': 'owner error'}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return JsonResponse({'error': 'input error'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)
	

def searchAlbumFile(request, key):
    albums = Album.objects.filter(title=key)
    serializer = AlbumSerializer(albums, many=True)
    return Response(serializer.data)
