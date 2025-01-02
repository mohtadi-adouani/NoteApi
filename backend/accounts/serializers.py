from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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

class TokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['userId'] = self.user.pk
        data['email'] = self.user.email
        data['token'] = data['access']
        return data

class MyTokenObtainPairSerializer(TokenSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add email to token
        token['username'] = user.username
        return token
