#!/usr/bin/env python3
"""
Admin Account Creation Script

This script creates an admin account for the IULS system.
Works with both SQLite and PostgreSQL databases.
Run this script to set up the initial administrator.
"""

import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db import Base
import models
import crud
from config import settings

def get_database_url():
    """Get database URL from environment or config"""
    # Priority: Environment variable > config file > default
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        try:
            db_url = getattr(settings, 'database_url', 'sqlite:///./iuls.db')
        except:
            db_url = 'sqlite:///./iuls.db'
    
    print(f"🔗 Using database: {db_url}")
    return db_url

def create_admin_account():
    """Create an admin account interactively"""
    
    print("🔐 IULS Admin Account Creation")
    print("=" * 40)
    
    # Database setup
    db_url = get_database_url()
    engine = create_engine(db_url)
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Get admin details
        print("\nEnter admin account details:")
        
        email = input("Email: ").strip()
        if not email:
            print("❌ Email is required")
            return False
            
        # Check if admin already exists
        existing_admin = crud.get_user_by_email(db, email=email)
        if existing_admin:
            print(f"❌ User with email '{email}' already exists")
            return False
        
        first_name = input("First Name: ").strip()
        father_name = input("Father Name: ").strip()
        grand_father_name = input("Grand Father Name: ").strip()
        
        password = input("Password: ").strip()
        if not password:
            print("❌ Password is required")
            return False
            
        confirm_password = input("Confirm Password: ").strip()
        if password != confirm_password:
            print("❌ Passwords do not match")
            return False
        
        phone_number = input("Phone Number (optional): ").strip()
        biography = input("Biography (optional): ").strip()
        
        # Create admin user
        from schemas import UserCreate
        admin_data = UserCreate(
            email=email,
            password=password,
            role=models.UserRole.ADMIN,
            first_name=first_name,
            father_name=father_name,
            grand_father_name=grand_father_name,
            phone_number=phone_number if phone_number else None,
            biography=biography if biography else None,
            status="ACTIVE"
        )
        
        admin_user = crud.create_user(db=db, user=admin_data)
        
        if admin_user:
            print(f"\n✅ Admin account created successfully!")
            print(f"   Email: {admin_user.email}")
            print(f"   Name: {admin_user.first_name} {admin_user.father_name}")
            print(f"   Role: {admin_user.role.value}")
            print(f"   ID: {admin_user.id}")
            print(f"\n🔑 You can now login using:")
            print(f"   POST /auth/login")
            print(f"   {{\"email\": \"{email}\", \"password\": \"{password}\"}}")
            return True
        else:
            print("❌ Failed to create admin account")
            return False
            
    except Exception as e:
        print(f"❌ Error creating admin account: {str(e)}")
        return False
    finally:
        db.close()

def create_default_admin():
    """Create a default admin account with preset credentials"""
    
    print("🔐 Creating Default Admin Account")
    print("=" * 40)
    
    # Database setup
    db_url = get_database_url()
    engine = create_engine(db_url)
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        default_email = "admin@iuls.edu"
        default_password = "admin123"
        
        # Check if admin already exists
        existing_admin = crud.get_user_by_email(db, email=default_email)
        if existing_admin:
            print(f"❌ Default admin '{default_email}' already exists")
            return False
        
        # Create default admin user
        from schemas import UserCreate
        admin_data = UserCreate(
            email=default_email,
            password=default_password,
            role=models.UserRole.ADMIN,
            first_name="System",
            father_name="Administrator",
            grand_father_name="Account",
            phone_number="+251911000000",
            biography="Default system administrator account",
            status="ACTIVE"
        )
        
        admin_user = crud.create_user(db=db, user=admin_data)
        
        if admin_user:
            print(f"\n✅ Default admin account created successfully!")
            print(f"   Email: {admin_user.email}")
            print(f"   Password: {default_password}")
            print(f"   Role: {admin_user.role.value}")
            print(f"   ID: {admin_user.id}")
            print(f"\n⚠️  IMPORTANT: Change the default password after first login!")
            print(f"🔑 Login credentials:")
            print(f"   POST /auth/login")
            print(f"   {{\"email\": \"{default_email}\", \"password\": \"{default_password}\"}}")
            return True
        else:
            print("❌ Failed to create default admin account")
            return False
            
    except Exception as e:
        print(f"❌ Error creating default admin account: {str(e)}")
        return False
    finally:
        db.close()

def main():
    """Main script function"""
    
    if len(sys.argv) > 1 and sys.argv[1] == "--default":
        # Create default admin
        success = create_default_admin()
    else:
        # Interactive admin creation
        print("Choose admin creation method:")
        print("1. Interactive (custom credentials)")
        print("2. Default admin account")
        
        choice = input("\nEnter choice (1 or 2): ").strip()
        
        if choice == "1":
            success = create_admin_account()
        elif choice == "2":
            success = create_default_admin()
        else:
            print("❌ Invalid choice")
            success = False
    
    if success:
        print("\n🎉 Admin account setup completed!")
        sys.exit(0)
    else:
        print("\n❌ Admin account setup failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
