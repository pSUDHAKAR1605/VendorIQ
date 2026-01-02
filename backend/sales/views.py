from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import transaction
from .models import Sale
from .serializers import SaleSerializer

class SaleViewSet(viewsets.ModelViewSet):
    serializer_class = SaleSerializer

    def get_queryset(self):
        return Sale.objects.filter(product__vendor=self.request.user)

    def perform_create(self, serializer):
        with transaction.atomic():
            # The sale is saved
            sale = serializer.save()
            # The product stock is decreased
            product = sale.product
            product.stock -= sale.quantity
            product.save()

    def perform_destroy(self, instance):
        with transaction.atomic():
            # Restore stock when sale is deleted
            product = instance.product
            product.stock += instance.quantity
            product.save()
            instance.delete()
