from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer

from .models import ApiUser


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
    write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(
    required=True,
    validators=[UniqueValidator(queryset=ApiUser.objects.all())]
    )

    class Meta:
        model = ApiUser
        fields = ('username', 'email', 'password', 'password2', 'bio')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = ApiUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            bio=validated_data['bio'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class AuthUserSerializer(serializers.ModelSerializer):
    """ user authentication response"""
    class Meta:
        model = ApiUser
        fields = ['id', 'username']

class TokenSerializer(TokenObtainPairSerializer):
    """ token authentication response """
    def validate(self, attrs):
        data = super().validate(attrs)
        data['access_lifetime'] = self.token_class.access_token_class.lifetime
        data['refresh_lifetime'] = self.token_class.lifetime
        data['user'] =  AuthUserSerializer(self.user).data

        return data

class MyTokenObtainPairSerializer(TokenSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add email to token
        token['username'] = user.username
        return token

class MyTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['access_lifetime'] = self.token_class.access_token_class.lifetime
        return data