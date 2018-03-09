from django.db import models
from django.contrib.auth.models import User

# Create your models here.
def cover_directory_path(instance, filename):
	# file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
	return 'photos/{0}/{1}'.format(instance.title, filename)

class AlbumFile(models.Model):
	id = models.AutoField(primary_key=True)
	owner = models.ForeignKey(User, on_delete=models.CASCADE)
	title = models.CharField(max_length=100,verbose_name='title')
	cover = models.ImageField(upload_to=cover_directory_path)
	createDate = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('createDate',)

def image_directory_path(instance, filename):
	# file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
	return 'photos/{0}/{1}'.format(instance.title.title, filename)

class Album(models.Model):
	id = models.AutoField(primary_key=True)
	title = models.ForeignKey(AlbumFile, on_delete=models.CASCADE)
	image = models.ImageField(upload_to=image_directory_path)
	createDate = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('createDate',)