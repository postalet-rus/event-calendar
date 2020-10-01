from django.contrib import admin
from .models import Event
from django.db import models


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    pass
# Register your models here.
