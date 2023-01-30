from django.db import models
from django.db import connection
from django.db.models.deletion import CASCADE
from django.db import models
from django.db.models.signals import pre_save, post_save
from django.utils.http import urlquote
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.utils.translation import ugettext_lazy as _
from rest_framework.authtoken.models import Token
import uuid


DIFFICULTY_LEVEL = (
    ('LVL1', 'Very Easy'),
    ('LVL2', 'Easy'),
    ('LVL3', 'Normal'),
    ('LVL4', 'Hard'),
    ('LVL5', 'Very Hard')
)

EXAM_TYPE = (
    ('F', 'Free'),
    ('P', 'Paid')
)


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """

    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_admin') is not True:
            raise ValueError(_('Superuser must have is_admin=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser):
    
    username = None
    first_name = models.CharField(max_length=50, blank=True)
    middle_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    email = models.EmailField(max_length=100, unique=True)
    USERNAME_FIELD = 'email'
    contact = models.CharField(max_length=13, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    address_line_1 = models.CharField(max_length=200, blank=True)
    address_line_2 = models.CharField(max_length=200, blank=True)
    state = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=200, blank=True)
    zip = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(auto_now=True, null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    objects = CustomUserManager()

    class Meta:
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email
    
    def get_absolute_url(self):
        return "/users/%s/" % urlquote(self.email)
    
    def has_perm(self, perm, obj=None):
        """Does the user have a specific permission?"""
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        """Does the user have permissions to view the app `app_label`?"""
        # Simplest possible answer: Yes, always
        return True


class Image(models.Model):
    _id = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    url = models.URLField(blank=True)
    name = models.CharField(max_length=255)
    folder = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Subject(models.Model):
    _id = models.CharField(max_length=3, primary_key=True)
    name = models.CharField(max_length=50)

    class Meta:
        verbose_name_plural = 'Subjects'

    def __str__(self):
        return self.name


class Topics(models.Model):
    _id = models.CharField(max_length=6, primary_key=True)
    name = models.CharField(max_length=200, default="Introduction")
    subject = models.ForeignKey(Subject, on_delete=CASCADE)

    class Meta:
        unique_together = [['name', 'subject']]
        verbose_name_plural = 'Topics'

    def __str__(self):
        return self.name


class Questions(models.Model):
    description = models.TextField(blank=True, null=True)
    attachment = models.ForeignKey(Image, on_delete=CASCADE, blank=True, null=True)
    topic = models.ForeignKey(Topics, on_delete=models.CASCADE, blank=True, null=True)
    difficulty_level = models.CharField(max_length=4, choices=DIFFICULTY_LEVEL)
    marks_allotted = models.IntegerField(default=4)
    correct_answer_probability = models.FloatField(default=0)

    class Meta:
        db_table = "core_questions"
        verbose_name_plural = 'Questions'

    def __str__(self):
        return str(self.pk)


class QuestionOptions(models.Model):
    for_question = models.ForeignKey(Questions, related_name="options", on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    attachment = models.ForeignKey(Image, on_delete=models.CASCADE, blank=True, null=True)
    is_correct = models.BooleanField(default=False)

    class Meta:
        db_table = "core_question_options"
        verbose_name_plural = 'Question Options'

    def __str__(self):
        return f"{self.for_question} | {self.description}"


class Examination(models.Model):
    exam_name = models.CharField(max_length=255, blank=True, null=True)
    exam_date = models.DateField(blank=True, null=True)
    difficulty_level = models.CharField(
        max_length=4, choices=DIFFICULTY_LEVEL, default='LVL3')
    full_marks = models.IntegerField(default=0)
    max_time = models.IntegerField(default=0)
    questions = models.ManyToManyField(Questions, related_name='examination')
    exam_type = models.CharField(
        max_length=1, choices=EXAM_TYPE, default='P'
    )

    class Meta:
        db_table = "core_examination"
        verbose_name_plural = '4.4. Examination'


class ExaminationResult(models.Model):
    pass


def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


post_save.connect(create_auth_token, sender=User)