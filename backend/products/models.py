from django.db import models
from django.conf import settings

class Product(models.Model):
    vendor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=10)
    market_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Market price for comparison")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.vendor.business_name})"

    @property
    def is_low_stock(self):
        return self.stock <= self.low_stock_threshold
