from django.shortcuts import render

# Create your views here.

def outlook_view(request):
	return render(request, 'outlook.html')