# -*- coding: utf-8 -*-

from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework import status
from django.contrib.auth.decorators import login_required

from django.conf import settings
import uuid

from apps.album.serializers import AlbumSerializer, AlbumFileSerializer, AlbumFileInfoSerializer
from apps.album.models import Album, AlbumFile

from apps.album.aImage import reduce_quantile

# Create your views here.

# 相册首页
@login_required
def album_view(request):
	return render(request, 'album.html')

# 相册的图片展示
@login_required
def albumitem_view(request, title):
	return render(request, 'albumitem.html',{'title': title})

# 相册的创建和上传
@login_required
def albumupload_view(request):
	return render(request, 'albumupload.html')

# 查询相册列表
@login_required
@api_view(['POST'])
def searchOwnerTitle_view(request):
	if request.method == 'POST':
		cover = request.POST.get('cover', None)
		title = request.POST.get('title', None)
		if cover:
			albumfile = AlbumFile.objects.filter(owner=request.user)
			if albumfile:
				if title:
					albumfile = albumfile.filter(title=title)
				if albumfile:
					serializer = AlbumFileSerializer(albumfile, many=True)
					return Response(serializer.data)
				else:
					return JsonResponse({'info': '暂无指定相册'}, status=status.HTTP_200_OK)
			else:
				return JsonResponse({'info': '暂无相册'}, status=status.HTTP_200_OK)
		else:
			albumfile = AlbumFile.objects.filter(owner=request.user)
			if albumfile:
				serializer = AlbumFileInfoSerializer(albumfile, many=True)
				return Response(serializer.data)
			else:
				return JsonResponse({'info': '暂无相册'}, status=status.HTTP_200_OK)
	else:
		return JsonResponse({'info': '请求方法错误，使用POST'}, status=status.HTTP_400_BAD_REQUEST)


# 创建相册
@login_required	
@api_view(['POST'])
def createOwnerTitle_view(request):
	if request.method == 'POST':
		title = request.POST.get('title', None)
		cover = request.FILES.get('cover', None)
		if title and cover:
			albumfile = AlbumFile(owner=request.user, title=title, cover=cover)
			albumfile.save()
			return JsonResponse({'info': '创建成功'}, status=status.HTTP_200_OK)
		else:
			return JsonResponse({'info': '请求参数错误'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'info': '请求方法错误，使用POST'}, status=status.HTTP_400_BAD_REQUEST)

#修改相册
@login_required	
@api_view(['POST'])
def updateOwnerTitle_view(request):
	if request.method == 'POST':
		ids = request.POST.get('id', None)
		title = request.POST.get('title', None)
		cover = request.FILES.get('cover', None)
		if ids and (title or cover):
			albumfile = AlbumFile.objects.get(id=ids)
			albumfile.title = title
			albumfile.cover = cover
			albumfile.save()
			return JsonResponse({'info': '更新成功'}, status=status.HTTP_200_OK)
		else:
			return JsonResponse({'info': '请求参数错误'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'info': '请求方法错误，使用POST'}, status=status.HTTP_400_BAD_REQUEST)

# 删除相册
@login_required	
@api_view(['POST'])
def deleteOwnerTitle_view(request):
	if request.method == 'POST':
		ids = request.POST.get('id', None)
		if ids:
			albumfile = AlbumFile.objects.get(id=ids)
			if albumfile:
				albums = Album.objects.filter(title=albumfile)
				if albums:
					albums.delete()
				albumfile.delete()
				return JsonResponse({'info': '删除成功'}, status=status.HTTP_200_OK)
			else:
				return JsonResponse({'info': '该相册不存在'}, status=status.HTTP_200_OK)
		else:
			return JsonResponse({'info': '请求参数错误'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'info': '请求方法错误，使用POST'}, status=status.HTTP_400_BAD_REQUEST)

# 获取相册图片列表
@login_required
@api_view(['POST'])
def searchAlbumList_view(request):
	if request.method == 'POST':
		title = request.POST.get('title', None)
		if title:
			albumfile = AlbumFile.objects.filter(owner=request.user, title=title)
			if albumfile:
				albums = Album.objects.filter(title=albumfile[0])
				if albums:
					serializer = AlbumSerializer(albums, many=True)
					return Response(serializer.data)
				else:
					return JsonResponse({'info': '暂无照片'}, status=status.HTTP_200_OK)
			else:
				return JsonResponse({'info': '该相册不存在'}, status=status.HTTP_200_OK)
		else:
			return JsonResponse({'info': '请求参数错误'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'info': '请求方法错误，使用POST'}, status=status.HTTP_400_BAD_REQUEST)

# 上传相册图片
@login_required
@api_view(['POST'])
def createAlbumList_view(request):
	if request.method == 'POST':
		ids = request.POST.get('id', None)
		image = request.FILES.get('image', None)
		image.name = str(uuid.uuid1()) + '.png'
		filepath = settings.MEDIA_ROOT + '/photos/' + ids + '/' + image.name
		if ids and image:
			albumfile = AlbumFile.objects.filter(owner=request.user, id=ids)
			if albumfile:
				albums = Album(title=albumfile[0], image=image)
				albums.save()
				reduce_quantile(filepath)
				return JsonResponse({'info': '上传成功'}, status=status.HTTP_200_OK)
			else:
				return JsonResponse({'info': '该相册不存在'}, status=status.HTTP_200_OK)
		else:
			return JsonResponse({'info': '请求参数错误'}, status=status.HTTP_400_BAD_REQUEST)
	else:
	    return JsonResponse({'info': '请求方法错误，使用POST'}, status=status.HTTP_400_BAD_REQUEST)

# 删除相册图片
@login_required
@api_view(['POST'])
def deleteAlbumList_view(request):
	if request.method == 'POST':
		ids = request.POST.get('id', None)
		if ids:
			album = Album.objects.filter(id=ids)
			if album:
				album.delete()
				return JsonResponse({'info': '删除成功'}, status=status.HTTP_200_OK)
			else:
				return JsonResponse({'info': '该图片不存在'}, status=status.HTTP_200_OK)
		else:
			return JsonResponse({'info': '请求参数错误'}, status=status.HTTP_400_BAD_REQUEST)
	else:
	    return JsonResponse({'info': '请求方法错误，使用POST'}, status=status.HTTP_400_BAD_REQUEST)
