from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('vendor',)

    def create(self, validated_data):
        validated_data['vendor'] = self.context['request'].user
        return super().create(validated_data)
