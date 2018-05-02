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
		outlook = request.FILES.getlist('file[]')
		if outlook:
			basepath = settings.MEDIA_ROOT+'/base.png'
			basescore = compare.score(basepath)
			scorelist = []
			for item in outlook:
				img = Image.open(item)
				path = settings.MEDIA_ROOT+'/temp.png'
				img.save(path)
				comscore = compare.score(path)
				score = compare.compareScore(basescore, comscore)
				scorelist.append(int(score*100))
			print(scorelist)
			finalscore = int(sum(scorelist)/len(scorelist))
			return JsonResponse({'info': finalscore}, status=200)
		else:
			return JsonResponse({'info': 'file none'}, status=200)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)