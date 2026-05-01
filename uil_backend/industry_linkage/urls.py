from rest_framework.routers import DefaultRouter
from .views import IndustryViewSet,RequestViewSet,RequestManageViewSet

router = DefaultRouter()
router.register(r'industries', IndustryViewSet)
router.register(r'requests',RequestViewSet,basename="request")
router.register(r'request-manages',RequestManageViewSet,basename="request-manage")

urlpatterns = router.urls