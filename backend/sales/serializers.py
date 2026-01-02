from rest_framework import serializers
from .models import Sale
from products.models import Product

class SaleSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = Sale
        fields = '__all__'
        read_only_fields = ('total_price',)

    def validate_product(self, value):
        if value.vendor != self.context['request'].user:
            raise serializers.ValidationError("Product does not belong to this vendor.")
        return value

    def validate(self, data):
        product = data['product']
        quantity = data['quantity']
        
        if quantity <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
            
        if product.stock < quantity:
            raise serializers.ValidationError(f"Insufficient stock. Available: {product.stock}")
        return data
