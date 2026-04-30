from rest_framework.routers import DefaultRouter
from .views import IndustryViewSet,IndustryRequestViewSet,IndustryRequestManageViewSet

router = DefaultRouter()
router.register(r'industries', IndustryViewSet)
router.register(r'requests',IndustryRequestViewSet)
router.register(r'request-manages',IndustryRequestManageViewSet)

urlpatterns = router.urls