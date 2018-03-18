from django.contrib import admin
from apps.reward.models import Activity, ActivityObject, Reward, RewardRecord

# Register your models here.
class ActivityAdmin(admin.ModelAdmin):
	search_fields = ('id', 'title', 'is_active', 'createDate',)
	list_display=('id', 'title', 'is_active', 'createDate',)
admin.site.register(Activity, ActivityAdmin)

class ActivityObjectAdmin(admin.ModelAdmin):
	search_fields = ('objectId',)
	list_display=('objectId', 'reward', 'probably', )
admin.site.register(ActivityObject, ActivityObjectAdmin)

class RewardAdmin(admin.ModelAdmin):
	list_display=('__str__', 'rewardCount', 'createDate',)
admin.site.register(Reward, RewardAdmin)

class RewardRecordAdmin(admin.ModelAdmin):
	list_display=('__str__', 'reward', 'createDate',)
admin.site.register(RewardRecord, RewardRecordAdmin)
