from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        permission_classes = (IsAuthenticated,)
        model = Post
        fields = ['id', 'title', 'body', 'author', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']