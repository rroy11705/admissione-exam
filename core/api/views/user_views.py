from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from core.models import User
from core.api.serializers import UserSerializer, UserSerializerWithToken, RegistrationSerializer, UserLoginSerializer
# Create your views here.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.hashers import make_password
from rest_framework import status


@api_view(['POST'])
def login(request):
        try:        
            serializer = UserLoginSerializer(data=request.data)
            data = {}
            
            if serializer.is_valid():
                
                account = serializer.data
                
                data['data'] = {
                    "user": UserSerializer(account).data,
                    "token": Token.objects.get(user__id=account["id"]).key
                }
                data['message'] = "Congrats! You are registered!"

                return Response(data, status=status.HTTP_200_OK)
            
            else:

                data = {
                    "message": "failure",
                    "reason": serializer.errors
                }

                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:

            return Response({"message":  "Failed to register!", "reason": f"Error: {e}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def registerUser(request):
    try:
            
        serializer = RegistrationSerializer(data=request.data)

        data = {}

        if serializer.is_valid():
            account = serializer.save()

            data['data'] = {
                "user": UserSerializer(account).data,
                "token": Token.objects.get(user=account).key
            }
            data['message'] = "Congrats! You are registered!"

            return Response(data, status=status.HTTP_201_CREATED)

        else:
            data = {
                "message": "failure",
                "reason": serializer.errors
            }
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        
    except Exception as e:
        return Response({"message":  "Failed to register!", "reason": f"Error: {e}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    try:
        user_token = request.auth.key
        serializer = UserSerializer(Token.objects.get(key=user_token).user, many=False)
        data = {}
        data['data'] = {
            "user": serializer.data,
            "token": Token.objects.get(user__id=serializer.data["id"]).key
        }
        data['message'] = "User Details fetched successfully!"
        return Response(data, status=status.HTTP_200_OK)
    except:
        data['message'] = "User Details fetched successfully!"
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('User was deleted')
