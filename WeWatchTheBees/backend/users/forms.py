from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError


User = get_user_model()


class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)  # теперь обязательное поле

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email", "password1", "password2")

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError('Пользователь с таким email уже существует.')
        return email

    def save(self, commit: bool = True):
        user = super().save(commit=False)
        user.is_active = True
        user.email = self.cleaned_data.get("email")
        if commit:
            user.save()
        return user