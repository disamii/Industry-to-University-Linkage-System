from rest_framework.routers import DefaultRouter
from .views import IndustryViewSet,RequestViewSet,RequestManageViewSet,AssignmentViewSet

router = DefaultRouter()
router.register(r'industries', IndustryViewSet)
router.register(r'requests',RequestViewSet,basename="request")
router.register(r'request-manages',RequestManageViewSet,basename="request-manage")
router.register(r'assignments',AssignmentViewSet,basename="assignment")


urlpatterns = router.urls