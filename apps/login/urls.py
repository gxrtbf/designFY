from django.conf.urls import url

from apps.login import views

urlpatterns = [
    url(r'^login/$', views.login_view),
]