"""
Definition of urls for DoughBot.
"""

from datetime import datetime
from django.urls import path
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from PizzaBot import forms, views


urlpatterns = [
    #TODO make the base URL do a redirect without referencing the view
    path("", views.pizza_view, name="pizza"),
    path("bread/", views.bread, name="bread"),
    path("pie/", views.pie, name="pie"),
    path("about/", views.about, name="about"),
    path("login/",
         LoginView.as_view
         (
             template_name="app/login.html",
             authentication_form=forms.BootstrapAuthenticationForm,
             extra_context=
             {
                 "title": "Log in",
                 "year" : datetime.now().year,
             }
         ),
         name="login"),
    path("logout/", LogoutView.as_view(next_page="/"), name="logout"),
    path("admin/", admin.site.urls),
]
