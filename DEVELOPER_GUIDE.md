# IULS Backend API - Developer Documentation

## 🔐 Authentication System Overview

The IULS (Industry-to-University Linkage System) backend provides a comprehensive authentication system with role-based access control (RBAC) supporting three distinct user types:

- **Users** (RPMS-integrated students/faculty)
- **Industries** (self-registering companies)  
- **Admins** (system administrators)

---

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r iuls_backend/requirements.txt

# Set environment variables
export DATABASE_URL="sqlite:///./iuls.db"
export SECRET_KEY="your-secret-key-here"
export ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES="30"

# Start server
cd iuls_backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Create First Admin

```bash
cd iuls_backend
python create_admin.py --default
```

**Default Admin Credentials:**
- Email: `admin@iuls.edu`
- Password: `admin123`

---

## 📋 Account Creation Methods

### 👤 User Accounts (RPMS Integration)

Users are created automatically when they first attempt to login. The system checks RPMS for user data and creates local accounts automatically.

#### Two-Step Authentication Flow:

**Step 1: Email Check**
```bash
POST /auth/check-email
Content-Type: application/json

{
  "email": "student@example.com"
}
```

**Response:**
```json
{
  "exists": true,
  "email": "student@example.com"
}
```

**Step 2: Login**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "rpms_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

#### Mock RPMS Users for Testing:
- `student@example.com` / `rpms_password`
- `faculty@example.com` / `rpms_password`

---

### 🏭 Industry Accounts (Self-Registration)

Industries can register themselves independently:

```bash
POST /industry/register
Content-Type: application/json

{
  "name": "Tech Company Inc.",
  "email": "company@tech.com",
  "password": "company123",
  "contact_person": "John Doe",
  "phone": "+251912345678",
  "industry_type": "Technology",
  "address": "123 Main Street, Addis Ababa",
  "website": "https://techcompany.com"
}
```

**Industry Login:**
```bash
POST /industry/login
Content-Type: application/json

{
  "email": "company@tech.com",
  "password": "company123"
}
```

---

### 👨‍💼 Admin Accounts

Admin accounts require special creation methods:

#### Method 1: Default Admin Script
```bash
cd iuls_backend
python create_admin.py --default
```

#### Method 2: Interactive Admin Creation
```bash
cd iuls_backend
python create_admin.py
```

#### Method 3: Admin-Created Accounts (Admin Only)
```bash
POST /users/create-admin-industry
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "email": "newadmin@iuls.edu",
  "password": "securepassword",
  "role": "admin"  // or "industry"
}
```

---

## 🛡️ Role-Based Access Control (RBAC)

### Available Roles:
- `user` - Students and faculty (RPMS-integrated)
- `admin` - System administrators  
- `industry` - Company representatives

### RBAC Dependencies:

```python
# Require specific role
@router.get("/admin-only")
async def admin_endpoint(current_user = Depends(require_admin)):
    return {"message": "Admin access only"}

# Require industry role
@router.get("/industry-only") 
async def industry_endpoint(current_user = Depends(require_industry)):
    return {"message": "Industry access only"}

# Multiple allowed roles
@router.get("/flexible")
async def flexible_endpoint(current_user = Depends(require_any_role(UserRole.ADMIN, UserRole.USER))):
    return {"message": "Admin or User access"}
```

---

## 🔧 Development Configuration

### RPMS Service Configuration

The mock RPMS service is located in `rpms_service.py`. To configure real RPMS integration:

```python
# In rpms_service.py
def get_user_from_rpms(email: str) -> Optional[Dict[str, Any]]:
    # Replace mock data with real RPMS API call
    # Example:
    # response = requests.get(f"https://rpms.university.edu/api/users/{email}")
    # return response.json() if response.status_code == 200 else None
```

### Database Configuration

```python
# In .env file
DATABASE_URL=sqlite:///./iuls.db
# Or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/iuls_db
```

### JWT Configuration

```python
# In config.py
class Settings(BaseSettings):
    secret_key: str
    algorithm: str = "HS256" 
    access_token_expire_minutes: int = 30
```

---

## 📊 API Endpoints Summary

### Authentication Endpoints:
- `POST /auth/check-email` - Check if email exists in local DB
- `POST /auth/login` - User login (two-step flow)
- `POST /industry/register` - Industry self-registration
- `POST /industry/login` - Industry login

### User Management:
- `GET /users/me` - Get current user profile
- `PUT /users/me/profile` - Update user profile
- `POST /users/create-admin-industry` - Admin-only user creation

### Industry Management:
- `GET /industry/` - List all industries
- `GET /industry/{id}` - Get industry details
- `POST /industry/` - Create industry (authenticated)

### Protected Resources:
- All endpoints except registration require `Authorization: Bearer <token>` header

---

## 🧪 Testing Guide

### Test Users (Mock RPMS):
```bash
# Student login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "student@example.com", "password": "rpms_password"}'

# Faculty login  
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "faculty@example.com", "password": "rpms_password"}'
```

### Test Industry:
```bash
# Register industry
curl -X POST "http://localhost:8000/industry/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Company", "email": "test@company.com", "password": "test123", "contact_person": "Test Contact"}'

# Login industry
curl -X POST "http://localhost:8000/industry/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@company.com", "password": "test123"}'
```

### Test Admin:
```bash
# Login admin
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@iuls.edu", "password": "admin123"}'
```

---

## 🔒 Security Features

### Password Hashing:
- **Algorithm**: Bcrypt (industry standard)
- **Salt**: Automatically generated per password
- **Work Factor**: Configurable for security vs performance

### Token Security:
- **Algorithm**: HS256 JWT
- **Expiration**: 30 minutes (configurable)
- **Subject**: User email

### User Enumeration Prevention:
- `/auth/check-email` returns generic responses
- No information leakage about account existence

---

## 🚀 Production Deployment

### Environment Variables:
```bash
export DATABASE_URL="postgresql://user:pass@localhost/iuls_prod"
export SECRET_KEY="your-super-secret-production-key"  
export ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES="30"
```

### Database Migration:
```bash
# For production with PostgreSQL/MySQL
alembic upgrade head
```

### Security Checklist:
- [ ] Change default admin password
- [ ] Use strong JWT secret key
- [ ] Configure HTTPS
- [ ] Set up database backups
- [ ] Configure CORS properly
- [ ] Replace mock RPMS with real API

---

## 📚 Additional Resources

### API Documentation:
- **Interactive Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Database Schema:
- **Users Table**: RPMS-integrated user accounts
- **Industry Table**: Self-registered company accounts  
- **JWT Tokens**: Stateless authentication

### Common Issues:
1. **Database errors**: Delete `iuls.db` and restart server
2. **Token issues**: Check JWT secret and expiration
3. **RPMS integration**: Update `rpms_service.py` with real API

---

## 🤝 Contributing

When adding new features:

1. Follow existing authentication patterns
2. Use proper RBAC dependencies
3. Maintain API consistency
4. Update documentation
5. Test with all user roles

---

## 📞 Support

For development questions or issues:
1. Check the API docs at `/docs`
2. Review the authentication flow
3. Test with mock users first
4. Verify environment configuration

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Framework**: FastAPI + SQLAlchemy
