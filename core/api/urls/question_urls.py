from django.urls import path
from core.api.views import question_views as views


urlpatterns = [

    path('', views.QuestionsListView.as_view(), name='question_list'),
    # path('<str:_id>/create/', views.QuestionsCreateView.as_view(), name='question_create'),
    # path('<str:_id>/update/', views.SubjectUpdateView.as_view(), name='question_update'),
    # path('<str:_id>/delete/', views.SubjectDeleteView.as_view(), name='question_delete'),
]