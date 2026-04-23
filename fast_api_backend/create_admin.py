#!/usr/bin/env python3
"""
Admin Account Creation Script - Final Version
Syncs with Backend Hashing Logic
"""

from config import settings
import models
from db import Base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import sys
import os
from pathlib import Path
import uuid

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))


# Attempt to import your app's hashing logic
try:
    from crud import get_password_hash
except ImportError:
    print("⚠️  Could not import get_password_hash from crud.py.")
    print("⚠️  Falling back to manual bcrypt hashing...")
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def get_password_hash(password):
        return pwd_context.hash(password)


def get_database_url():
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        try:
            db_url = getattr(settings, 'database_url', 'sqlite:///./iuls.db')
        except:
            db_url = 'sqlite:///./iuls.db'
    return db_url


def get_or_create_default_unit(db):
    unit = db.query(models.OrganizationalUnit).first()
    if not unit:
        print("🏗️  Creating default Organizational Unit...")
        unit = models.OrganizationalUnit(
            id=str(uuid.uuid4()),
            name="System Administration",
            unit_type="ADMIN",
            abbreviation="SYS"
        )
        db.add(unit)
        db.commit()
        db.refresh(unit)
    return unit


def create_admin_logic(db, email, password, first_name, father_name, grand_father_name, phone=None, bio=None):
    try:
        # 1. Check if Account exists
        existing_account = db.query(models.Account).filter(
            models.Account.email == email).first()
        if existing_account:
            print(
                f"❌ Account with email '{email}' already exists. Updating password...")
            existing_account.password = get_password_hash(password)
            db.commit()
            return existing_account

        # 2. Ensure Org Unit exists
        unit = get_or_create_default_unit(db)

        # 3. Hash the password correctly for the ADMIN role
        hashed_password = get_password_hash(password)

        # 4. Create Account
        new_account = models.Account(
            id=str(uuid.uuid4()),
            email=email,
            password=hashed_password,
            role=models.UserRole.ADMIN
        )
        db.add(new_account)
        db.flush()

        # 5. Create Staff Profile
        new_profile = models.StaffProfile(
            id=str(uuid.uuid4()),
            account_id=new_account.id,
            first_name=first_name,
            father_name=father_name,
            grand_father_name=grand_father_name,
            phone_number=phone,
            biography=bio,
            academic_unit_id=unit.id,
            status="ACTIVE"
        )
        db.add(new_profile)
        db.commit()
        return new_account

    except Exception as e:
        db.rollback()
        print(f"❌ Database Error: {str(e)}")
        return None


def create_default_admin():
    print("🔐 Creating/Resetting Default Admin Account")
    print("=" * 40)

    db_url = get_database_url()
    print(f"🔗 Using database: {db_url}")
    engine = create_engine(db_url)
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    try:
        email = "admin@bdu.et"
        password = "password"

        admin = create_admin_logic(
            db, email, password,
            "System", "Administrator", "Account",
            "+251911000000", "Default system administrator"
        )

        if admin:
            print(f"\n✅ Admin account is ready!")
            print(f"   Email: {email}")
            print(f"   Password: {password}")
            return True
        return False
    finally:
        db.close()


def main():
    # Force default for this run to fix your current issue
    success = create_default_admin()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
