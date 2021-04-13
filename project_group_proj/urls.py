import debug_toolbar
from django.conf import settings
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('project_group_app.urls')),
    path('admin/', admin.site.urls),
    path('debug/', include(debug_toolbar.urls)),
]