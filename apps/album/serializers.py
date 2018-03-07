from rest_framework import serializers

from apps.album.models import Album,AlbumFile

class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = ('id', 'title', 'image', 'createDate')

class AlbumFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlbumFile
        fields = ('id', 'owner', 'title', 'createDate')