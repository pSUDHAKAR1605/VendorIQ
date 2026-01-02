# VendorIQ - Smart Analytics for Small Vendors

VendorIQ is a full-stack business intelligence platform designed to empower small-scale vendors with data-driven insights. It helps vendors analyze sales trends, maintain optimal inventory levels, and stay price-competitive in their local markets.

## 🚀 Business Impact

Small vendors often operate on intuition. VendorIQ transforms this by providing:
- **Inventory Optimization**: Rule-based predictions for restocking prevent lost sales due to stockouts and reduce overstocking costs.
- **Price Competitiveness**: Automated detection of price mismatches against market benchmarks ensures vendors remain attractive to customers while protecting margins.
- **Sales Strategy**: Identifying best-selling products allows vendors to focus on high-margin, high-velocity items.

## 🛠️ Tech Stack

- **Backend**: Django, Django REST Framework (DRF)
- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Recharts
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **Auth**: JWT (JSON Web Tokens)
- **Styling**: Modern, responsive UI with a focus on data visualization.

## 📂 Project Structure

```text
VendorIQ/
├── backend/            # Django REST Framework API
│   ├── core/           # Project settings and main dashboard logic
│   ├── vendors/        # Vendor authentication and profiles
│   ├── products/       # Inventory and product management
│   └── sales/          # Sales recording and tracking
└── frontend/           # React + Vite Application
    ├── src/api/        # Axios configuration
    ├── src/components/ # Shared UI components (Layout, etc.)
    ├── src/context/    # Authentication state management
    └── src/pages/      # Dashboard, Login, and Registration views
```

## 📈 Key Features

- **Sales Analytics**: Visual representation of best-selling products and revenue growth.
- **Inventory Status**: Real-time tracking of stock levels with low-stock alerts.
- **Price Comparison**: Logic to detect if products are overpriced or underpriced compared to market averages.
- **Restock Prediction**: Simple but effective rule-based engine to suggest restock quantities based on 30-day sales velocity.

---

## 📄 Resume-Ready Description

**VendorIQ | Full-Stack Developer | [Date]**
*Developed a business intelligence dashboard for small-scale vendors using Django and React.*

- Built a robust **RESTful API** using **Django REST Framework** to manage products, sales, and vendor authentication (JWT).
- Implemented **custom analytics logic** in Python to identify best-selling items and predict restock requirements using a rule-based velocity engine.
- Engineered a **modern responsive frontend** with **React** and **Tailwind CSS**, featuring data visualizations with **Recharts** to display sales trends.
- Designed a **price-monitoring algorithm** that detects >10% price mismatches against market data, helping vendors maintain competitive pricing.
- Automated database seeding with a custom **Django management command** for seamless development and testing.
