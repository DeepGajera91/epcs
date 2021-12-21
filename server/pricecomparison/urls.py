from django.urls import path, re_path, include
from . import views

urlpatterns = [
    path("",views.index,name="home"),
    path("populer/",views.populer,name="populer"),
    path("register/",views.signup,name="signup"),
    path("login/", views.login, name="login"),
    path("email/", views.email, name="email"),
    path("product/<str:product>", views.product, name="product")
]