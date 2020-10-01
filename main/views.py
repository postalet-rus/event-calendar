from django.views.generic import TemplateView
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Event
import json


class Auth(TemplateView):
    template_name = "main/index.html"


def authentication(request):
    if request.method == "POST":
        raw_data = json.loads(request.body)
        username = raw_data['login']
        password = raw_data['password']
        user = authenticate(request, username=username, password=password)
        if not user:
            return HttpResponse()
        else:
            login(request, user)
            return HttpResponseRedirect("/")
    elif request.method == "GET":
        return HttpResponse()


def logout_user(request):
    logout(request)
    return HttpResponseRedirect("/")


def get_events(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            raw_data = json.loads(request.body)
            start_query_date = raw_data['first']
            end_query_date = raw_data['last']
            events = Event.get_date_filtered(start_query_date=start_query_date,
                                             end_query_date=end_query_date)
            json_posts = json.dumps(list(events))
            return HttpResponse(json_posts)
