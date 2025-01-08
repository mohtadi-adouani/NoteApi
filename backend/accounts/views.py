from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import ApiUser
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer, MyTokenRefreshSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class MyTokenRefreshView(TokenRefreshView):
    serializer_class = MyTokenRefreshSerializer

class RegisterView(generics.CreateAPIView):
    queryset = ApiUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
