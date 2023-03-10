# Generated by Django 3.2.8 on 2023-01-19 21:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('first_name', models.CharField(blank=True, max_length=50)),
                ('middle_name', models.CharField(blank=True, max_length=50)),
                ('last_name', models.CharField(blank=True, max_length=50)),
                ('email', models.EmailField(max_length=100, unique=True)),
                ('contact', models.CharField(blank=True, max_length=13)),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('address_line_1', models.CharField(blank=True, max_length=200)),
                ('address_line_2', models.CharField(blank=True, max_length=200)),
                ('state', models.CharField(blank=True, max_length=200)),
                ('city', models.CharField(blank=True, max_length=200)),
                ('zip', models.CharField(blank=True, max_length=20)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('last_login', models.DateTimeField(auto_now=True, null=True)),
                ('date_joined', models.DateTimeField(auto_now_add=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Users',
            },
        ),
        migrations.CreateModel(
            name='ExaminationResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('_id', models.CharField(max_length=3, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name_plural': 'Subjects',
            },
        ),
        migrations.CreateModel(
            name='Topics',
            fields=[
                ('_id', models.CharField(max_length=6, primary_key=True, serialize=False)),
                ('name', models.CharField(default='Introduction', max_length=200)),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.subject')),
            ],
            options={
                'verbose_name_plural': 'Topics',
                'unique_together': {('name', 'subject')},
            },
        ),
        migrations.CreateModel(
            name='Questions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_description', models.CharField(blank=True, max_length=1000, null=True)),
                ('attachment_url', models.CharField(blank=True, max_length=200, null=True)),
                ('difficulty_level', models.CharField(choices=[('LVL1', 'Very Easy'), ('LVL2', 'Easy'), ('LVL3', 'Normal'), ('LVL4', 'Hard'), ('LVL5', 'Very Hard')], max_length=4)),
                ('marks_allotted', models.IntegerField(default=4)),
                ('correct_answer_probability', models.FloatField(default=0)),
                ('topic', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.topics')),
            ],
            options={
                'verbose_name_plural': '4.1. Questions',
                'db_table': 'core_questions',
            },
        ),
        migrations.CreateModel(
            name='QuestionOptions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('option_description', models.CharField(blank=True, max_length=1000, null=True)),
                ('attachment_url', models.CharField(blank=True, max_length=200, null=True)),
                ('is_correct', models.BooleanField(default=False)),
                ('for_question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.questions')),
            ],
            options={
                'verbose_name_plural': 'Question Options',
                'db_table': 'core_question_options',
            },
        ),
        migrations.CreateModel(
            name='Examination',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('exam_name', models.CharField(blank=True, max_length=255, null=True)),
                ('exam_date', models.DateField(blank=True, null=True)),
                ('difficulty_level', models.CharField(choices=[('LVL1', 'Very Easy'), ('LVL2', 'Easy'), ('LVL3', 'Normal'), ('LVL4', 'Hard'), ('LVL5', 'Very Hard')], default='LVL3', max_length=4)),
                ('full_marks', models.IntegerField(default=0)),
                ('max_time', models.IntegerField(default=0)),
                ('exam_type', models.CharField(choices=[('F', 'Free'), ('P', 'Paid')], default='P', max_length=1)),
                ('questions', models.ManyToManyField(related_name='examination', to='core.Questions')),
            ],
            options={
                'verbose_name_plural': '4.4. Examination',
                'db_table': 'core_examination',
            },
        ),
    ]
