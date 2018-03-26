from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.conf import settings
from PIL import Image

from apps.outlook import detect

# Create your views here.

def outlook_view(request):
	return render(request, 'outlook.html')

@api_view(['POST'])
def findface_view(request):
	if request.method == 'POST':
		outlook = request.FILES.get('outlook', None)
		if outlook:
			img = Image.open(outlook)
			img.save(settings.MEDIA_ROOT+'/temp.jpg')

			aipFace = detect.aipFace
			options = {
				'max_face_num': 1,
				'face_fields': "age,beauty,expression,faceshape"
			}
			with open(settings.MEDIA_ROOT+'/temp.jpg', 'rb') as fp:
				result = aipFace.detect(fp.read(), options)
				return JsonResponse({'info': result}, status=200)
		else:
			return JsonResponse({'info': 'None'}, status=200)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)