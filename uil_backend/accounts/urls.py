from django.urls import path,include
from rest_framework.routers import DefaultRouter
from accounts import views
from .views import PrivateUserRetrieveView, user_excel_by_academic_unit

router = DefaultRouter()
router.register(r'users',views.CustomUserViewSet,basename='user')
router.register(r'users-public',views.PublicUserViewSet,basename='user-public')


urlpatterns = router.urls+[
    path("token/login/", views.CustomTokenObtainPairView.as_view(), name="custom_token_create"),
    path('dashboard/summary/', views.dashboard_summary, name='dashboard-summary'),
    path("private/user/", PrivateUserRetrieveView.as_view()),
    path("academic-units/<int:pk>/researchers-excel/",user_excel_by_academic_unit,name="user_excel_by_academic_unit"),
]
