from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('designfy/admin/', admin.site.urls),
    path('designfy/', include('apps.login.urls')),
    path('designfy/', include('apps.index.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)