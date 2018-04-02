from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.conf import settings
from rest_framework import status
from PIL import Image
from django.contrib.auth.decorators import login_required

from apps.outlook import detect

# Create your views here.

@login_required
def outlook_view(request):
	return render(request, 'outlook.html')

@login_required
@api_view(['POST'])
def findface_view(request):
	if request.method == 'POST':
		outlook = request.FILES.get('outlook', None)
		if outlook:
			img = Image.open(outlook)
			img.save(settings.MEDIA_ROOT+'/temp.png')

			aipFace = detect.aipFace
			options = {
				'max_face_num': 1,
				'face_fields': "age,beauty,expression,faceshape,gender,glasses,race"
			}
			with open(settings.MEDIA_ROOT+'/temp.png', 'rb') as fp:
				result = aipFace.detect(fp.read(), options)
				if result['result_num'] == 1:
					return JsonResponse({'info': result['result']}, status=200)
				else:
					return JsonResponse({'info': 'no detect people'}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return JsonResponse({'info': 'None'}, status=200)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)