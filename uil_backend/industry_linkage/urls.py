from rest_framework.routers import DefaultRouter
from .views import IndustryViewSet,IndustryRequestViewSet

router = DefaultRouter()
router.register(r'industries', IndustryViewSet)
router.register(r'requests',IndustryRequestViewSet)
urlpatterns = router.urls