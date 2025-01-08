from django.urls import path
from .views import RegisterView, MyTokenObtainPairView, MyTokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='account_register'),
    #Authentication
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
]