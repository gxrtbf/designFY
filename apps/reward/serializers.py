from rest_framework import serializers

from apps.reward.models import Reward, RewardRecord, ActivityObject

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

