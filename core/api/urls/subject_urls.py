from django.urls import path
from core.api.views import subject_views as views


urlpatterns = [

    path('', views.SubjectsListView.as_view(), name='subject_list'),
    path('create/', views.SubjectCreateView.as_view(), name='subject_create'),
    path('<str:_id>/update/', views.SubjectUpdateView.as_view(), name='subject_update'),
    path('<str:_id>/delete/', views.SubjectDeleteView.as_view(), name='subject_delete'),

    path('<str:_id>/topics/', views.TopicsListView.as_view(), name='topics_by_subject_id'),
    path('<str:_id>/topic/create/', views.TopicCreateView.as_view(), name='topic_create'),
    path('topic/<str:_id>/update/', views.TopicsUpdateView.as_view(), name='topic_update'),
    path('topic/<str:_id>/delete/', views.TopicsDeleteView.as_view(), name='topic_delete'),
                                                                    
    path('topic/<str:_id>/question/create/', views.QuestionsCreateView.as_view(), name='question_create'),                                                                
]