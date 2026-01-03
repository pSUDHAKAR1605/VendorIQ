from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from core.views import DashboardStatsView, api_root
from rest_framework.routers import DefaultRouter
from products.views import ProductViewSet
from sales.views import SaleViewSet
from vendors.views import RegisterView, ProfileView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'sales', SaleViewSet, basename='sale')

urlpatterns = [
    path('admin/', admin.site.urls),
    # Group all API endpoints under api/
    path('api/', include([
        path('', api_root, name='api-root'),
        path('auth/register/', RegisterView.as_view(), name='register'),
        path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('auth/profile/', ProfileView.as_view(), name='profile'),
        path('dashboard/', DashboardStatsView.as_view(), name='dashboard'),
        path('', include(router.urls)),
    ])),
    path('', api_root), # Fallback for root
]
