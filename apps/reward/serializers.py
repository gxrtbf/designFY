from rest_framework import serializers

from apps.reward.models import Reward, RewardRecord, ActivityObject, Activity

class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = ('rewardCount',)

class RewardRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = RewardRecord
        fields = ('getReward', 'createDate',)

class ActivityObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityObject
        fields = ('reward', 'unit', 'probably')

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ('id', 'title',)

