from django.core.management.base import BaseCommand
from vendors.models import Vendor
from products.models import Product
from sales.models import Sale
from django.utils import timezone
import random
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seed the database with dummy data'

    def handle(self, *args, **kwargs):
        # 1. Create a Vendor
        vendor, created = Vendor.objects.get_or_create(
            email='vendor@example.com',
            defaults={
                'full_name': 'John Doe',
                'business_name': 'Tech Gadgets Store',
            }
        )
        if created:
            vendor.set_password('password123')
            vendor.save()
            self.stdout.write(self.style.SUCCESS('Created vendor: vendor@example.com'))

        # 2. Create Products
        categories = ['Electronics', 'Accessories', 'Wearables']
        product_names = [
            ('Laptop Pro', 1200, 1100),
            ('Smartphone X', 800, 850),
            ('Wireless Mouse', 25, 20),
            ('USB-C Cable', 15, 12),
            ('Smartwatch S3', 250, 260),
            ('Bluetooth Speaker', 60, 55),
            ('Gaming Headset', 120, 130),
            ('External SSD 1TB', 100, 95),
            ('Mechanical Keyboard', 85, 80),
            ('Webcam HD', 45, 50),
        ]

        products = []
        for name, price, m_price in product_names:
            p, created = Product.objects.get_or_create(
                vendor=vendor,
                name=name,
                defaults={
                    'category': random.choice(categories),
                    'price': Decimal(price),
                    'market_price': Decimal(m_price),
                    'stock': random.randint(5, 50),
                    'low_stock_threshold': 10
                }
            )
            products.append(p)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {name}'))

        # 3. Create Sales
        if Sale.objects.filter(product__vendor=vendor).count() == 0:
            for _ in range(50):
                product = random.choice(products)
                qty = random.randint(1, 3)
                if product.stock >= qty:
                    Sale.objects.create(
                        product=product,
                        quantity=qty,
                        date=timezone.now() - timezone.timedelta(days=random.randint(0, 30))
                    )
            self.stdout.write(self.style.SUCCESS('Created 50 dummy sales'))

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
