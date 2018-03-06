# -*- coding: utf-8 -*-

from django.shortcuts import render
from django.contrib.auth import login,logout,authenticate
from django import forms
from django.http import HttpResponse,HttpResponseRedirect

# Create your views here.

class UserForm(forms.Form):
    username = forms.CharField(label='名称',max_length=20)
    password = forms.CharField(label='密码',widget=forms.PasswordInput())


def login_view(request):

    if request.method == 'GET':
        return render(request,'login.html')
    elif request.method == 'POST':
        uf = UserForm(request.POST)
        if uf.is_valid():
            username = uf.cleaned_data['username']
            password = uf.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None and user.is_active:
                login(request,user)
                return HttpResponseRedirect("/index/")
            else:
            	return render(request,'login.html',{'sign': '账号或密码输入错误！'})	
        else:
        	return render(request,'login.html',{'sign': '输入无效！'})
    else:
    	pass