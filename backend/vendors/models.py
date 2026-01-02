from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class VendorManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class Vendor(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    business_name = models.CharField(max_length=255)

    objects = VendorManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'business_name']

    def __str__(self):
        return self.email
