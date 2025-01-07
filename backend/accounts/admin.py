from django.contrib import admin
from .models import ApiUser

class ApiAdmin(admin.ModelAdmin):
    pass

admin.site.register(ApiUser, ApiAdmin)
