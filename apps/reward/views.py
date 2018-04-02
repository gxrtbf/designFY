from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework import status
from django.contrib.auth.decorators import login_required

from apps.reward.serializers import ActivitySerializer, ActivityObjectSerializer, RewardSerializer, RewardRecordSerializer
from apps.reward.models import Activity, ActivityObject, Reward, RewardRecord

# Create your views here.
@login_required
def reward_view(request):
	return render(request, 'reward.html')

@login_required
@api_view(['GET'])
def searchActivity_view(request):
	if request.method == 'GET':
		activity = Activity.objects.filter(is_active=0)
		if activity:
			serializer = ActivitySerializer(activity, many=True)
			return Response(serializer.data)
		else:
			return JsonResponse({'error': 'activity error'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)

@login_required
@api_view(['POST'])
def searchActivityObjectNum_view(request):
	if request.method == 'POST':
		activityId = request.POST.get('acId', None)
		if activityId:
			activity = Activity.objects.filter(id=activityId)
			if activity and activity[0].is_active == 0:
				reward = Reward.objects.filter(actionId=activity[0], owner=request.user)
				if reward:
					serializer = RewardSerializer(reward, many=True)
					return Response(serializer.data)
				else:
					return JsonResponse({'info': 'None'}, status=200)
			else:
				return JsonResponse({'error': 'activity close'}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return JsonResponse({'error': 'activity error'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)

@login_required
@api_view(['POST'])
def searchActivityObject_view(request):
	if request.method == 'POST':
		activityId = request.POST.get('acId', None)
		if activityId:
			activity = Activity.objects.filter(id=activityId)
			if activity and activity[0].is_active == 0:
				actobj = ActivityObject.objects.filter(objectId=activity[0])
				if actobj:
					serializer = ActivityObjectSerializer(actobj, many=True)
					return Response(serializer.data)
				else:
					return JsonResponse({'info': 'None'}, status=200)
			else:
				return JsonResponse({'error': 'activity close'}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return JsonResponse({'error': 'activity error'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)

@login_required
@api_view(['POST'])
def searchRewardRecord_view(request):
	if request.method == 'POST':
		activityId = request.POST.get('acId', None)
		if activityId:
			activity = Activity.objects.filter(id=activityId)
			if activity and activity[0].is_active == 0:
				reward = Reward.objects.filter(actionId=activity[0], owner=request.user)
				if reward:
					record = RewardRecord.objects.filter(rewardId=reward[0])
					if record:
						serializer = RewardRecordSerializer(record, many=True)
						return Response(serializer.data)
					else:
						return JsonResponse({'info': 'None'}, status=200)
				else:
					return JsonResponse({'error': 'reward close'}, status=status.HTTP_400_BAD_REQUEST)
			else:
				return JsonResponse({'error': 'activity close'}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return JsonResponse({'error': 'activity error'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)

@login_required
@api_view(['POST'])
def updateActivity_view(request):
	if request.method == 'POST':
		activityId = request.POST.get('acId', None)
		objectId = request.POST.get('object', None)
		if activityId and objectId:
			activity = Activity.objects.filter(id=activityId)
			if activity and activity[0].is_active == 0:
				reward = Reward.objects.filter(actionId=activity[0], owner=request.user)
				if reward and reward[0].rewardCount > 0:
					actobj = ActivityObject.objects.filter(reward=objectId)
					if actobj:
						reward[0].rewardCount = reward[0].rewardCount - 1
						reward[0].save()
						rrd = RewardRecord(rewardId=reward[0], reward=actobj[0])
						rrd.save()
						return JsonResponse({'info': 'success'}, status=200)
					else:
						return JsonResponse({'info': 'reward is none'}, status=200)
				else:
					return JsonResponse({'info': 'no num'}, status=200)
			else:
				return JsonResponse({'error': 'activity close'}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return JsonResponse({'error': 'activity error'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'error': 'request method error'}, status=status.HTTP_400_BAD_REQUEST)




