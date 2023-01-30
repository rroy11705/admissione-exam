import boto3
import os
from django.conf import settings

def handle_image(file, file_name, folder):

    # generate unique file name
    _, file_extension = os.path.splitext(file.name)
    file_name_with_extension = f'{file_name}{file_extension}'

    # Upload image to S3
    s3 = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
    
    # upload image to S3
    s3.upload_fileobj(file, settings.AWS_STORAGE_BUCKET_NAME, f'image/{folder}/{file_name_with_extension}')
    
    return (file_name_with_extension, f'{settings.AWS_BASE_URL}/image/{folder}/{file_name_with_extension}')