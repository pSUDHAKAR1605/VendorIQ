from django.contrib import admin
from .models import Vendor

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'business_name', 'is_staff')
    search_fields = ('email', 'full_name', 'business_name')
