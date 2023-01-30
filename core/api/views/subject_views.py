from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from core.models import Image, Subject, Topics, Questions
from core.api.serializers import SubjectSerializer, TopicsSerializer, QuestionsSerializer, QuestionOptionsSerializer
from core.api.pagination import SmallPagination
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from django.http import Http404


class SubjectsListView(ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    pagination_class = SmallPagination
    permission_classes = (IsAdminUser,)
    allowed_methods = ('GET',)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset()).order_by('_id')

        data = {}
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data['data'] = {
                'subjects': serializer.data
            }
            data['message'] = "Fetched subjects successfully."
            return Response(self.get_paginated_response(data), status=status.HTTP_200_OK)

        serializer = self.get_serializer(queryset, many=True)
        data['data'] = {
            'subjects': serializer.data
        }
        data['message'] = "Fetched subjects successfully."
        return Response(self.get_paginated_response(data), status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False)
    def advanced_search(self, request):
        search = request.query_params.get('search', None)

        subjects = Subject.objects.all()
        if search is not None:
            subjects = subjects.filter(
                _id__icontains=search, name__icontains=search)

        page = self.paginate_queryset(subjects)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(subjects, many=True)
        return Response(serializer.data)

    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


class SubjectCreateView(CreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = (IsAdminUser,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = {}
        data['data'] = {
            'subject': serializer.data,
        }
        data['message'] = "Subject created successfully."
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


class SubjectUpdateView(UpdateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = (IsAdminUser,)
    lookup_field = '_id'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('_id', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        data = {}
        data['data'] = {
            'subject': serializer.data,
        }
        data['message'] = "Subject updated successfully."
        return Response(data, status=status.HTTP_200_OK)

    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


class SubjectDeleteView(DestroyAPIView):
    queryset = Subject.objects.all()
    permission_classes = (IsAdminUser,)
    lookup_field = '_id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = SubjectSerializer(instance)
        self.perform_destroy(instance)
        data = {}
        data['data'] = {
            'subject': serializer.data,
        }
        data['message'] = "Subject deleted successfully."
        return Response(data, status=status.HTTP_200_OK)


class TopicsListView(ListAPIView):
    serializer_class = TopicsSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = SmallPagination
    lookup_field = '_id'
    ordering = ['_id']

    def get_queryset(self):
        subject_id = self.kwargs['_id']
        return Topics.objects.filter(subject___id=subject_id)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).order_by('_id')

        data = {}
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            print(page)
            data['data'] = {
                'topics': serializer.data,
            }
            data['message'] = "Fetched topics successfully."
            return Response(self.get_paginated_response(data), status=status.HTTP_200_OK)

        serializer = self.get_serializer(queryset, many=True)
        data['data'] = {
            'topics': serializer.data,
        }
        data['message'] = "Fetched topics successfully."
        return Response(self.get_paginated_response(data), status=status.HTTP_200_OK)

    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


class TopicCreateView(CreateAPIView):
    queryset = Topics.objects.all()
    serializer_class = TopicsSerializer
    permission_classes = (IsAdminUser,)
    pagination_class = SmallPagination
    lookup_field = '_id'

    def perform_create(self, serializer):
        subject_id = self.kwargs['_id']
        subject = Subject.objects.get(pk=subject_id)
        serializer.save(subject=subject)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = {}
        data['data'] = {
            'topic': serializer.data,
        }
        data['message'] = "Topic created successfully."
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


class TopicsUpdateView(UpdateAPIView):
    queryset = Topics.objects.all()
    serializer_class = TopicsSerializer
    permission_classes = (IsAdminUser,)
    lookup_field = '_id'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('_id', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        data = {}
        data['data'] = {
            'topic': serializer.data,
        }
        data['message'] = "Topic updated successfully."
        return Response(data, status=status.HTTP_200_OK)


class TopicsDeleteView(DestroyAPIView):
    queryset = Topics.objects.all()
    serializer_class = TopicsSerializer
    permission_classes = (IsAdminUser,)
    lookup_field = '_id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = TopicsSerializer(instance)
        self.perform_destroy(instance)
        data = {}
        data['data'] = {
            'topic': serializer.data,
        }
        data['message'] = 'Subitem deleted successfully'
        return Response(data, status=status.HTTP_200_OK)

    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


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
            questions = questions.filter(
                _id__icontains=search, name__icontains=search)

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


class QuestionsCreateView(CreateAPIView):
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer
    permission_classes = (IsAdminUser,)

    def perform_create(self, serializer):
        topic_id = self.kwargs['_id']
        topic = Topics.objects.get(pk=topic_id)
        serializer.save(topic=topic)

    def create(self, request, *args, **kwargs):

        # get attachments from request
        attachment_id = request.data.get("attachment", None)
        if attachment_id:
            request.data["attachment"] = Image.objects.get(
                _id=attachment_id).pk

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # get options data from request
        # options_data = request.data.get('options', [])
        # options = []
        # for option_data in options_data:
        #     option_data['for_question'] = serializer.data['_id']
        #     option_serializer = QuestionOptionsSerializer(data=option_data)
        #     option_serializer.is_valid(raise_exception=True)
        #     option_serializer.save()
        #     options.append(option_serializer.data)

        headers = self.get_success_headers(serializer.data)

        data = {}
        data['data'] = {
            'subject': serializer.data,
        }
        data['message'] = "Question and options created successfully."
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)
