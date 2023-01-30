from django.contrib import admin
from .models import User, Questions, QuestionOptions

class QuestionOptionsInline(admin.TabularInline):
    model = QuestionOptions
    extra = 0


class QuestionsClassAdmin(admin.ModelAdmin):
    list_display = ('description', 'topic', 'difficulty_level')
    ordering = ['topic', 'difficulty_level']
    inlines = [QuestionOptionsInline]

admin.site.register(Questions, QuestionsClassAdmin)
admin.site.register(User)
