from django.urls import path
from core.api.views import file_views as views

urlpatterns = [
    path('upload/', views.ImageUploadView.as_view(), name='upload_file'),
]