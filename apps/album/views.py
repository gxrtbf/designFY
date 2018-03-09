from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework import status

from apps.album.serializers import AlbumSerializer, AlbumFileSerializer, AlbumFileInfoSerializer
from apps.album.models import Album, AlbumFile

# Create your views here.

def album_view(request):
	return render(request, 'album.html')

def albumitem_view(request,key):
	return render(request, 'albumitem.html')

def albumupload_view(request):
	return render(request, 'albumupload.html')

@api_view(['POST'])
def searchOwnerTitle_view(request):
	if request.method == 'POST':
		cover = request.POST.get('cover', None)
		if not cover:
			albumfile = AlbumFile.objects.filter(owner=request.user)
			if albumfile:
				serializer = AlbumFileInfoSerializer(albumfile, many=True)
				return Response(serializer.data)
			else:
				return JsonResponse({'info': 'None'}, status=200)
		else:
			albumfile = AlbumFile.objects.filter(owner=request.user)
			if albumfile:
				serializer = AlbumFileSerializer(albumfile, many=True)
				return Response(serializer.data)
			else:
				return JsonResponse({'info': 'None'}, status=200)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)
	
@api_view(['POST'])
def createOwnerTitle_view(request):
	if request.method == 'POST':
		title = request.POST.get('title', None)
		cover = request.FILES.get('cover', None)
		if title and cover:
			albumfile = AlbumFile(owner=request.user, title=title, cover=cover)
			albumfile.save()
			return JsonResponse({'info': 'create success'}, status=200)
		else:
			return JsonResponse({'error': 'input error'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def searchAlbumList_view(request):
	if request.method == 'POST':
		title = request.POST.get('title', None)
		if owner and title:
			albumfile = AlbumFile.objects.filter(owner=request.user, title=title)
			if albumfile:
				albums = Album.objects.filter(title=albumfile)
				if albums:
					serializer = AlbumSerializer(albums, many=True)
					return Response(serializer.data)
				else:
					return JsonResponse({'info': 'alnum none'}, status=200)
			else:
				return JsonResponse({'info': 'albumfile none'}, status=200)
		else:
			return JsonResponse({'error': 'input error'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def createAlbumList_view(request):
	if request.method == 'POST':
		title = request.POST.get('title', None)
		image = request.FILES.get('image', None)
		if title and image:
			albumfile = AlbumFile.objects.filter(owner=request.user, title=title)
			if albumfile:
				albums = Album(title=albumfile[0], image=image)
				albums.save()
				return JsonResponse({'info': 'create success'}, status=200)
			else:
				return JsonResponse({'info': 'alnumfile none'}, status=200)
		else:
			return JsonResponse({'error': 'input error'}, status=status.HTTP_400_BAD_REQUEST)
	else:
	    return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)
