from django.conf.urls import url

from apps.index import views

urlpatterns = [
    url(r'^index/$', views.index_view),
]