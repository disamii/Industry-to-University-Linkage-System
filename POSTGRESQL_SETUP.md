# PostgreSQL Setup for IULS Backend

## 🐘 For Developers Using PostgreSQL

### 📋 Prerequisites
- PostgreSQL installed and running
- Database created
- Python dependencies installed

### 🔧 Environment Setup

#### 1. Create Database
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE iuls_db;
CREATE USER iuls_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE iuls_db TO iuls_user;
```

#### 2. Set Environment Variables
```bash
# For PostgreSQL
export DATABASE_URL="postgresql://iuls_user:your_password@localhost:5432/iuls_db"

# Other required variables
export SECRET_KEY="your-secret-key-here"
export ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES="30"
```

#### 3. Install PostgreSQL Driver
```bash
pip install psycopg2-binary
```

### 🚀 Start the Server
```bash
cd iuls_backend
source ../venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 🔐 Create Admin Account
```bash
# The updated script now works with PostgreSQL!
python create_admin.py --default
```

### 🧪 Test Connection
```bash
# Test admin login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@iuls.edu", "password": "admin123"}'
```

### 🐳 Docker Alternative
```dockerfile
# Dockerfile
FROM python:3.14
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: iuls_db
      POSTGRES_USER: iuls_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./iuls_backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://iuls_user:your_password@postgres:5432/iuls_db
      SECRET_KEY: your-secret-key
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### 🔍 Troubleshooting

#### Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U iuls_user -d iuls_db
```

#### Permission Issues
```sql
-- Grant permissions if needed
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO iuls_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO iuls_user;
```

#### Python Issues
```bash
# Install missing dependencies
pip install psycopg2-binary sqlalchemy
```

### 📊 Database Migration (Optional)
```bash
# If using Alembic for migrations
alembic upgrade head
```

### 🎯 Quick Start Commands
```bash
# 1. Setup environment
export DATABASE_URL="postgresql://user:pass@localhost/iuls_db"

# 2. Create admin
python create_admin.py --default

# 3. Start server
uvicorn main:app --reload

# 4. Test
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@iuls.edu", "password": "admin123"}'
```

### 🤝 Team Setup
Share these details with your team:
- Database connection string
- Default admin credentials
- Environment variable setup
- Any additional configuration

The updated `create_admin.py` script now automatically detects and works with PostgreSQL databases!
