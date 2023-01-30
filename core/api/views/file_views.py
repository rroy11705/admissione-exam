from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from core.api.utils import image
from core.api.serializers import ImageSerializer
from core.models import Image
from rest_framework import status
import uuid

class ImageUploadView(CreateAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    parser_class = (FileUploadParser,)

    def create(self, request, *args, **kwargs):
        file_obj = request.data['file']
        folder = request.data['folder']
        file_name = str(uuid.uuid4())
        (file_name_with_extension, image_url) = image.handle_image(file_obj, file_name, folder)
        request.data['_id'] = file_name
        request.data['name'] = file_name_with_extension
        request.data['url'] = image_url
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        file_obj = request.data['file']
        data = {}
        data['data'] = {
                'image': serializer.data
            }
        data['message'] = "Fetched questions successfully."
        return Response(data, status=status.HTTP_201_CREATED)