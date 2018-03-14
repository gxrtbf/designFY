from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class LoveWords(models.Model):
	id = models.AutoField(primary_key=True)
	owner = models.ForeignKey(User, on_delete=models.CASCADE)
	content = models.TextField(max_length=1000)
	createDate = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('createDate',)
