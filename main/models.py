from django.db import models
from django.db.models import fields
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
import calendar


def validate_hour(value):
    try:
        result = int(value)
    except ValueError:
        raise ValidationError("Часы начала мероприятия должны быть числом")
    if result < 0 or result > 24:
        raise ValidationError("Часы начала мероприятия должны принадлежать промежутку от 0 до 24")
    if value.len() < 2:
        raise ValidationError("Часы должны иметь формат ЧЧ (например 09 - 9 часов)")


def validate_minute(value):
    try:
        result = int(value)
    except ValueError:
        raise ValidationError("Минуты начала мероприятия должны быть числом")
    if result < 0 or result > 60:
        raise ValidationError("Минуты начала мероприятия должны принадлежать промежутку от 0 до 60")
    if value.len() < 2:
        raise ValidationError("Минуты должны иметь формат ММ (например 01 - 1 минута)")


def validate_date(value):
    result = validate_setup(value)
    if result == 1000:
        raise ValidationError('Дата не соответствует формату UTC(YYYY-MM-DD)')
    if result == 1100:
        raise ValidationError('Год не соответствует формату UTC(YYYY),'
                              ' или не входит в промежуток (2000:2040)')
    if result == 1010:
        raise ValidationError('Месяц не соответствует формату UTC(MM) или не существует')
    if result == 1001:
        raise ValidationError('День не соответствует формату UTC(DD) или не существует')


def validate_setup(value):
    result = value.split('-')

    # check length of value (YYYY-MM-DD). len must be 3
    if len(result) != 3:
        result = 1000
        return result
    # try to parse 3 values to integer. ex:2020, 1, 1
    try:
        result[0] = int(result[0])
        result[1] = int(result[1])
        result[2] = int(result[2])
    except ValueError:
        result = 1000
        return result

    if result[0] < 2000 or result[0] > 2040:
        result = 1100
        return result

    if result[1] < 1 or result[1] > 12:
        result = 1010
        return result

    if result[2] < 1 or result[2] > calendar.monthrange(result[0], result[1])[1]:
        result = 1001
        return result

    if result[1] < 10:
        month_utc = '0' + str(result[1])
    else:
        month_utc = '' + str(result[1])

    if result[2] < 10:
        day_utc = '0' + str(result[2])
    else:
        day_utc = '' + str(result[2])

    result = "" + str(result[0]) + '-' + month_utc + '-' + day_utc
    return result


class Event(models.Model):
    title = fields.CharField(verbose_name="заголовок мероприятия", max_length=100)
    responsible = models.ForeignKey(User, related_name="login", on_delete=models.CASCADE,
                                    verbose_name="ответственный")
    description = fields.CharField(verbose_name="описание мероприятия", max_length=300, blank=True)
    date = fields.CharField(max_length=10, validators=[validate_date])
    hour_start = fields.CharField(max_length=2, default="00")
    minute_start = fields.CharField(max_length=2, default="00")

    @classmethod
    def create(cls, title, responsible, description, date, hour_start, minute_start):
        hour_formatted = str(int(hour_start))
        minute_formatted = str(int(minute_start))
        event = cls(title=title, responsible=responsible, description=description, date=date,
                    hour_start=hour_formatted, minute_start=minute_formatted)
        event.save()
        print(event)
        return event

    @classmethod
    def get_date_filtered(cls, start_query_date, end_query_date):
        result = cls.objects.filter(date__range=[start_query_date, end_query_date]).values_list(
            "pk",
            "title",
            "responsible_id__username",
            "description",
            "date",
            "hour_start",
            "minute_start"
        )
        return result
# Create your models here.
