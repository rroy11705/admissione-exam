from rest_framework import serializers
from rest_framework.authtoken.models import Token
from core.models import User, Subject, Image, Topics, Questions, QuestionOptions
from django.db.models import Q


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "first_name", "middle_name", "last_name", "email", "contact", "date_of_birth", "address_line_1", "address_line_2", "state", "city", "zip", "is_admin"]
        depth = 1


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'middle_name', 'last_name', 'email', 'contact', 'token']

    def get_token(self, obj):
        token = Token.objects.get(user=obj).key
        return str(token)


class UserLoginSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = '__all__'
        
    def to_internal_value(self, data):
        try:
            try:
                email = data["email"]
                user = User.objects.filter(email=email)
                return data
            except KeyError:
                raise serializers.ValidationError(
                    {'email': 'Please Input your Email'})
            except ValueError:
                raise serializers.ValidationError({'email': 'Email Not Valid'})
        except User.DoesNotExist:
            raise serializers.ValidationError({'error': 'Database Error'})

    def validate(self, data):
        user_obj = None
        email = data.get('email', None)
        password = data.get('password', None)
        if not email:
            raise serializers.ValidationError({"error": "Need to be filled"})

        user = User.objects.filter(
            Q(email=email)
        ).distinct()
        user = user.exclude(email__isnull=True).exclude(email__iexact='')
        if user.exists() and user.count() == 1:
            user_obj = user.first()
        else:
            raise serializers.ValidationError({"email": "Not valid"})
        if user_obj:
            if not user_obj.check_password(password):
                raise serializers.ValidationError(
                    {"password": "Incorrect credentials please try again"})
                
        return user_obj


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'middle_name', 'last_name', 'email', 'contact', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):

        password = self.validated_data['password']

        if User.objects.filter(email=self.validated_data['email']).exists():
            raise serializers.ValidationError(
                {'error': 'Email already exists!'})
            
        account = User(
            first_name=self.validated_data['first_name'],
            middle_name=self.validated_data['middle_name'],
            last_name=self.validated_data['last_name'],
            email=self.validated_data['email'], 
            contact=self.validated_data['contact'],
        )
        account.set_password(password)
        account.save()

        return account


    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_admin
     

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('_id', 'url', 'name', 'folder', 'created_at', 'updated_at')


class TopicsSerializer(serializers.ModelSerializer):
    subject = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Topics
        fields = ["_id", "name", "subject"]
        depth = 1

    def get_subject(self, obj):
        subject = Subject.objects.get(pk=obj.subject._id)
        return subject.name


class SubjectSerializer(serializers.ModelSerializer):
    topics = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Subject
        fields = ["_id", "name", "topics"]
        depth = 1

    def get_topics(self, obj):
        items = obj.topics_set.all()
        serializer = TopicsSerializer(items, many=True)
        return serializer.data


class QuestionOptionsSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = QuestionOptions
        fields = ["_id", "description", "attachment", "is_correct"]

    def get__id(self, obj):
        return obj.pk if obj else None


class QuestionsSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField(read_only=True)
    options = QuestionOptionsSerializer(read_only=False, many=True)

    class Meta:
        model = Questions
        fields = ["_id", "description", "options", "attachment", "topic", "difficulty_level", "marks_allotted"]

    def get__id(self, obj):
        return obj.pk if obj else None

    
    def create(self, validated_data):
        options_data = validated_data.pop("options")
        question = Questions.objects.create(**validated_data)
        for option_data in options_data:
            QuestionOptions.objects.create(for_question=question, **option_data)
        return question

    