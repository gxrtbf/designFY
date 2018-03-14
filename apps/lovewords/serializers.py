from rest_framework import serializers

from apps.album.models import LoveWords

class LoveWordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoveWords
        fields = ('id', 'content', 'createDate')
