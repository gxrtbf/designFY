from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.conf import settings
from rest_framework import status
from django.contrib.auth.decorators import login_required
from PIL import Image

from apps.note import compare
# Create your views here.

@login_required
def note_view(request):
	return render(request, 'note.html')

@login_required
@api_view(['POST'])
def compareface_view(request):
	if request.method == 'POST':
		outlook = request.FILES.get('face', None)
		print(outlook)
		if outlook:
			img = Image.open(outlook)
			path1 = settings.MEDIA_ROOT+'/temp.png'
			img.save(path1)
			path2 = settings.MEDIA_ROOT+'/base.png'
			score = compare.compareScore(path1, path2)
			print(score)
			return JsonResponse({'info': int(score[0][0]*100)}, status=200)
		else:
			return JsonResponse({'info': 'file none'}, status=200)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)