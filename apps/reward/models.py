from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Activity(models.Model):
	id = models.AutoField(primary_key=True)
	title = models.CharField(max_length=100)
	memo = models.CharField(max_length=500)
	is_active = models.IntegerField()
	createDate = models.DateTimeField(auto_now_add=True)
	lastUpdate = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ('lastUpdate',)

	def __str__(self):
		return self.title

class ActivityObject(models.Model):
	objectId = models.ForeignKey(Activity, on_delete=models.CASCADE)
	reward = models.CharField(max_length=100)
	unit = models.CharField(max_length=100)
	memo = models.CharField(max_length=500)
	probably = models.IntegerField()
	createDate = models.DateTimeField(auto_now_add=True)
	lastUpdate = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ('lastUpdate',)

	def __str__(self):
		return self.reward

class Reward(models.Model):
	id = models.AutoField(primary_key=True)
	actionId = models.ForeignKey(Activity, on_delete=models.CASCADE)
	owner = models.ForeignKey(User, on_delete=models.CASCADE)
	rewardCount = models.IntegerField()
	lastUpdate = models.DateTimeField(auto_now=True)
	createDate = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('lastUpdate',)

	def __str__(self):
		return self.actionId.title + '-' + self.owner.username

class RewardRecord(models.Model):
	id = models.AutoField(primary_key=True)
	rewardId = models.ForeignKey(Reward, on_delete=models.CASCADE)
	reward = models.ForeignKey(ActivityObject, on_delete=models.CASCADE)
	createDate = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('createDate',)

	def __str__(self):
		return self.rewardId.actionId.title + '-' + self.rewardId.owner.username + '-' + self.reward.reward

	def getReward(self):
		return self.reward.reward + ' ' + self.reward.unit