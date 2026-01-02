from django.contrib import admin
from .models import Sale

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('product', 'quantity', 'total_price', 'date')
    list_filter = ('date', 'product__vendor')
    search_fields = ('product__name', 'product__vendor__business_name')
