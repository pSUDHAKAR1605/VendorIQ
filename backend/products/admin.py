from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'vendor', 'category', 'price', 'stock', 'low_stock_threshold', 'market_price')
    list_filter = ('category', 'vendor')
    search_fields = ('name', 'vendor__business_name')
