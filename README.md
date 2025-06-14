# New Class Royal Ministries - Church Management System

## About New Class Royal Ministries

**Mission Statement:** Called for Community Influence

**Address:** Lilanda West, Lusaka, Zambia

**Contact Information:**
- WhatsApp: +260 975 639 834 / +260 766 496 511
- Email: newclassroyalministries@gmail.com
- Facebook: New Class Royal Ministries

## About Our Founder - Apostle Noah C. Mulanga

Noah C. Mulanga is a prominent community leader and the founder of New Class Royal Ministries in Lusaka, Zambia. His ministry, which began unexpectedly in 2005, has evolved over two decades into a holistic approach addressing the spiritual, mental, and physical well-being of individuals and communities.

### Qualifications & Certifications
- Bachelor's Degree in Practical Ministry
- Advanced Diploma in Pastoral and Counseling Ministry
- Diploma in Community Alcohol and Drugs Facilitation
- Community Health Ministry (CHM) Training - Meros Center, Wisconsin, USA
- International Coach/Trainer and Cultural Consultant for Global Resilience Oral Workshop (GROW) Ministry

### Ministry Impact
In 2013, Apostle Mulanga established **REACTS Divine Ministerial College**, which has since trained over 400 ministers of the gospel from diverse Christian denominations. His extensive community-based work spans Zambia, the USA, and Malawi, focusing on:

- Alcohol and drug prevention
- Trauma healing and resilience building
- Community health ministry
- Ministerial training and development
- Sports ministry integration

Supported by a network of over 40 trained facilitators, Apostle Mulanga actively promotes the integration of faith, mental health, and sports, notably serving on the board of directors of a sports foundation.

## System Overview

This Django-based church management system provides comprehensive tools for managing all aspects of New Class Royal Ministries' operations, including:

### Core Features
- **Church Information Management** - Contact details, mission, vision, and organizational information
- **Staff & Leadership Management** - Detailed profiles including qualifications and specializations
- **Ministry Management** - Various ministry types including education, health, counseling, and community outreach
- **Program Management** - Training programs, workshops, conferences, and special initiatives

### Specialized Modules
- **Sermons Management** - Audio/video sermons, series, and educational content
- **Events Management** - Church events, workshops, training sessions, and conferences
- **Prayer Requests** - Community prayer support system
- **Donations** - Secure donation processing and campaign management
- **Newsletter** - Community communication and updates
- **Live Streaming** - Online service broadcasting and engagement
- **Member Management** - Congregation and participant management

## Technical Stack

- **Backend:** Django 4.2.7 with Django REST Framework
- **Database:** PostgreSQL (production) / SQLite (development)
- **Authentication:** JWT-based authentication
- **File Storage:** AWS S3 (production) / Local storage (development)
- **Email:** AWS SES (production) / Console (development)
- **Payment Processing:** Stripe integration
- **API Documentation:** Swagger/OpenAPI with drf-spectacular

## Key Ministries & Programs

### REACTS Divine Ministerial College
Established in 2013, providing comprehensive ministerial training with over 400 graduates from diverse Christian denominations.

### Community Health Ministry (CHM)
Holistic health approach integrating faith, health education, and practical community care.

### Trauma Healing & Resilience Building
Specialized ministry combining biblical principles with therapeutic techniques for community healing.

### Alcohol & Drug Prevention Ministry
Community-focused prevention and rehabilitation support programs.

### Global Resilience Oral Workshop (GROW)
International resilience-building initiative with cross-cultural consultation.

## Installation & Setup

### Prerequisites
- Python 3.11+
- PostgreSQL (for production)
- Redis (for caching and Celery)

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd church_backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Environment Configuration**
Create a `.env` file in the root directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=church_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

5. **Database Setup**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata fixtures/initial_data.json
python manage.py createsuperuser
```

6. **Run Development Server**
```bash
python manage.py runserver
```

### Production Deployment

The system is configured for deployment on platforms like Heroku, AWS, or DigitalOcean with:
- PostgreSQL database
- AWS S3 for media storage
- AWS SES for email delivery
- Redis for caching
- Gunicorn as WSGI server

## API Documentation

Once the server is running, access the API documentation at:
- Swagger UI: `http://localhost:8000/api/docs/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

## Key API Endpoints

### Core Endpoints
- `GET /api/core/church-info/` - Church information
- `GET /api/core/staff/` - Staff and leadership
- `GET /api/core/ministries/` - Ministry listings
- `GET /api/core/programs/` - Program information

### Ministry-Specific Endpoints
- `GET /api/sermons/` - Sermon library
- `GET /api/events/` - Church events
- `GET /api/prayer/` - Prayer requests
- `GET /api/donations/campaigns/` - Donation campaigns
- `GET /api/livestream/current/` - Live streaming

## Contributing

This system is designed to serve New Class Royal Ministries' unique mission of community influence through holistic ministry. Contributions should align with the ministry's values and operational needs.

## Contact & Support

For technical support or ministry-related inquiries:
- **Email:** newclassroyalministries@gmail.com
- **WhatsApp:** +260 975 639 834 / +260 766 496 511
- **Address:** Lilanda West, Lusaka, Zambia

## License

This project is developed specifically for New Class Royal Ministries and their community influence mission.

---

*"Called for Community Influence" - New Class Royal Ministries*