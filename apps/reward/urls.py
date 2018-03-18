from django.urls import path

from apps.reward import views

urlpatterns = [
    path('reward/', views.reward_view, name='reward'),
    path('rewardNum/search/', views.searchActivityObjectNum_view),
    path('rewardObject/search/', views.searchActivityObject_view),
    path('rewardRecord/search/', views.searchRewardRecord_view),
    path('rewardRecord/update/', views.updateActivity_view),
]