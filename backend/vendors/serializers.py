from rest_framework import serializers
from .models import Vendor

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ('id', 'email', 'full_name', 'business_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Vendor.objects.create_user(**validated_data)
        return user

class VendorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ('id', 'email', 'full_name', 'business_name')
