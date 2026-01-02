from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, F
from products.models import Product
from sales.models import Sale
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "name": "VendorIQ API",
        "status": "Running",
        "endpoints": {
            "auth": "/api/auth/",
            "dashboard": "/api/dashboard/",
            "products": "/api/products/",
            "sales": "/api/sales/",
            "admin": "/admin/"
        }
    })

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vendor = request.user
        
        # 1. Basic Stats
        total_products = Product.objects.filter(vendor=vendor).count()
        total_sales = Sale.objects.filter(product__vendor=vendor).count()
        total_revenue = Sale.objects.filter(product__vendor=vendor).aggregate(Sum('total_price'))['total_price__sum'] or 0
        low_stock_alerts = Product.objects.filter(vendor=vendor, stock__lte=F('low_stock_threshold')).count()

        # 2. Best Selling Products (Python logic as requested)
        best_selling_raw = Sale.objects.filter(product__vendor=vendor).values('product__name').annotate(total_qty=Sum('quantity'), total_revenue=Sum('total_price')).order_by('-total_qty')[:5]
        
        # 3. Price Mismatch Detection (Detect if current price is > 10% different from market price)
        price_mismatches = []
        products = Product.objects.filter(vendor=vendor, market_price__isnull=False)
        for p in products:
            if not p.market_price or p.market_price == 0:
                continue
                
            diff = abs(p.price - p.market_price)
            if diff > (p.market_price * Decimal('0.1')):
                price_mismatches.append({
                    'id': p.id,
                    'name': p.name,
                    'price': p.price,
                    'market_price': p.market_price,
                    'deviation': (float(p.price - p.market_price) / float(p.market_price)) * 100,
                    'status': 'Overpriced' if p.price > p.market_price else 'Underpriced'
                })

        # 4. Restock Requirements & ML Prediction
        restock_needs = []
        low_stock_list = []
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)
        
        for p in Product.objects.filter(vendor=vendor):
            # Check for low stock alerts (Tiered: Critical vs Warning)
            status = 'Healthy'
            if p.stock <= p.low_stock_threshold:
                status = 'Critical'
            elif p.stock <= p.low_stock_threshold * 2:
                status = 'Warning'

            if status != 'Healthy':
                low_stock_list.append({
                    'id': p.id,
                    'name': p.name,
                    'stock': p.stock,
                    'low_stock_threshold': p.low_stock_threshold,
                    'status': status
                })

            # ML-Based Sales Prediction
            sales_data = Sale.objects.filter(product=p, date__date__gte=thirty_days_ago).values('date__date').annotate(daily_qty=Sum('quantity')).order_by('date__date')
            
            if sales_data.count() >= 5: # Need at least 5 days of data for a basic trend
                df = pd.DataFrame(list(sales_data))
                df['date_ordinal'] = df['date__date'].apply(lambda x: x.toordinal())
                
                X = df[['date_ordinal']].values
                y = df['daily_qty'].values
                
                model = LinearRegression()
                model.fit(X, y)
                
                # Predict sales for the next 7 days
                next_7_days = np.array([today.toordinal() + i for i in range(1, 8)]).reshape(-1, 1)
                predictions = model.predict(next_7_days)
                predicted_weekly_sales = max(0, float(np.sum(predictions)))
                monthly_velocity = predicted_weekly_sales / 7.0
            else:
                # Fallback to simple average if not enough data
                recent_sales_total = Sale.objects.filter(product=p, date__date__gte=thirty_days_ago).aggregate(Sum('quantity'))['quantity__sum'] or 0
                monthly_velocity = float(recent_sales_total) / 30.0
                predicted_weekly_sales = monthly_velocity * 7.0

            # Prediction: days until stock runs out
            days_left = float(p.stock) / monthly_velocity if monthly_velocity > 0 else 999
            
            # Tiered Restock Prediction (Critical < 14 days, Warning < 30 days)
            prediction_status = 'Healthy'
            if p.stock <= p.low_stock_threshold or days_left < 14:
                prediction_status = 'Critical'
            elif p.stock <= p.low_stock_threshold * 2 or days_left < 30:
                prediction_status = 'Warning'

            if prediction_status != 'Healthy':
                restock_needs.append({
                    'id': p.id,
                    'name': p.name,
                    'current_stock': p.stock,
                    'suggested_restock': int(max(p.low_stock_threshold * 2 - p.stock, predicted_weekly_sales * 4)),
                    'days_stock_left': int(days_left) if days_left < 999 else '30+',
                    'predicted_weekly_sales': round(predicted_weekly_sales, 1),
                    'confidence': 'High' if sales_data.count() >= 10 else 'Medium' if sales_data.count() >= 5 else 'Low',
                    'status': prediction_status
                })

        return Response({
            'stats': {
                'total_products': total_products,
                'total_sales': total_sales,
                'total_revenue': total_revenue,
                'low_stock_alerts': low_stock_alerts
            },
            'best_selling': list(best_selling_raw),
            'price_mismatches': price_mismatches,
            'restock_recommendations': restock_needs,
            'low_stock': low_stock_list
        })
