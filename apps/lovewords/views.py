from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework import status
from django.contrib.auth.decorators import login_required

from apps.album.serializers import LoveWordsSerializer
from apps.album.models import LoveWords

@login_required
def lovewords_view(request):
	return render(request, 'lovewords.html')

@login_required
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
