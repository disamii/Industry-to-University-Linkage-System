from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import crud, models, schemas, auth

router = APIRouter(
    prefix="/posts",
    tags=["posts"],
)

@router.get("/", response_model=List[schemas.Post])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(auth.get_db)):
    posts = crud.get_posts(db, skip=skip, limit=limit)
    return posts

@router.post("/", response_model=schemas.Post)
def create_post(post: schemas.PostCreate, db: Session = Depends(auth.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Check if user has permission (e.g. OFFICE_ADMIN)
    return crud.create_post(db=db, title=post.title, post_type_id=post.post_type_id, **post.model_dump(exclude={"title", "post_type_id"}))

@router.get("/{post_id}", response_model=schemas.Post)
def read_post(post_id: str, db: Session = Depends(auth.get_db)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@router.get("/types", response_model=List[schemas.PostType])
def read_post_types(db: Session = Depends(auth.get_db)):
    return db.query(models.PostType).all()
