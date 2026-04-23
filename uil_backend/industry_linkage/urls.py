from rest_framework.routers import DefaultRouter
from .views import IndustryViewSet

router = DefaultRouter()
router.register(r'industries', IndustryViewSet)

urlpatterns = router.urls