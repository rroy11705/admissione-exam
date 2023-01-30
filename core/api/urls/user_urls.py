from django.urls import path
from core.api.views import user_views as views


urlpatterns = [
    path('login/', views.login, name='login'),

    path('register/', views.registerUser, name='register'),

    path('me/', views.getUserProfile, name="users_profile"),
    path('profile/update/', views.updateUserProfile, name="user-profile-update"),
    path('', views.getUsers, name="users"),

    path('<str:pk>/', views.getUserById, name='user'),

    path('update/<str:pk>/', views.updateUser, name='user-update'),

    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
]