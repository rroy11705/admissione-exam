from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from core.models import Topics, Questions
from core.api.utils import image
from core.api.serializers import SubjectSerializer, QuestionsSerializer, QuestionOptionsSerializer
from core.api.pagination import SmallPagination
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from django.http import Http404


class QuestionsListView(ListAPIView):
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer
    pagination_class = SmallPagination
    permission_classes = (IsAuthenticated,)
    allowed_methods = ('GET',)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        data = {}
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data['data'] = {
                'questions': serializer.data
            }
            data['message'] = "Fetched questions successfully."
            return Response(self.get_paginated_response(data), status=status.HTTP_200_OK)

        serializer = self.get_serializer(queryset, many=True)
        data['data'] = {
            'questions': serializer.data
        }
        data['message'] = "Fetched questions successfully."
        return Response(self.get_paginated_response(data), status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False)
    def advanced_search(self, request):
        search = request.query_params.get('search', None)

        questions = Questions.objects.all()
        if search is not None:
            questions = questions.filter(_id__icontains=search, name__icontains=search)

        page = self.paginate_queryset(questions)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(questions, many=True)
        return Response(serializer.data)

    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)
    


# class SubjectUpdateView(UpdateAPIView):
#     queryset = Subject.objects.all()
#     serializer_class = SubjectSerializer
#     permission_classes = (IsAdminUser,)
#     lookup_field = '_id'

#     def update(self, request, *args, **kwargs):
#         partial = kwargs.pop('_id', False)
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
#         data = {}
#         data['data'] = {
#             'subject': serializer.data,
#         }
#         data['message'] = "Subject updated successfully."
#         return Response(data, status=status.HTTP_200_OK)
    
#     def handle_exception(self, exc):
#         if isinstance(exc, Http404):
#             return Response(status=status.HTTP_404_NOT_FOUND)
#         return super().handle_exception(exc)


# class SubjectDeleteView(DestroyAPIView):
#     queryset = Subject.objects.all()
#     permission_classes = (IsAdminUser,)
#     lookup_field = '_id'

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = SubjectSerializer(instance)
#         self.perform_destroy(instance)
#         data = {}
#         data['data'] = {
#             'subject': serializer.data,
#         }
#         data['message'] = "Subject deleted successfully."
#         return Response(data, status=status.HTTP_204_NO_CONTENT)
