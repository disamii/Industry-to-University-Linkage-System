from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from typing import List
import crud, schemas, auth
from exceptions import BadRequestException, NotFoundException, UnauthorizedException  # add these if not yet created
from models import  *
router = APIRouter(
    prefix="/posts",
    tags=["posts"],
)



@router.get("/", response_model=Page[schemas.Post])
def read_posts(db: Session = Depends(auth.get_db)):
    """
    Returns a paginated list of posts. 
    The library automatically handles 'page' and 'size' query params.
    """
    return paginate(db.query(Post))

@router.post("/", response_model=schemas.Post)
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(auth.get_db),
    current_user:  StaffProfile = Depends(auth.get_current_active_user)
):
    if not current_user:
        raise UnauthorizedException(detail="Authentication required")
    
    # Add permission check if needed
    # if current_user.role != "OFFICE_ADMIN":
    #     raise ForbiddenException(detail="You do not have permission to create posts")
    
    try:
        return crud.create_post(
            db=db,
            title=post.title,
            post_type_id=post.post_type_id,
            **post.model_dump(exclude={"title", "post_type_id"})
        )
    except Exception as e:
        raise BadRequestException(detail=str(e))

@router.get("/{post_id}", response_model=schemas.Post)
def read_post(post_id: str, db: Session = Depends(auth.get_db)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise NotFoundException(detail="Post not found")
    return db_post

@router.get("/types", response_model=List[schemas.PostType])
def read_post_types(db: Session = Depends(auth.get_db)):
    post_types = db.query(core_models.PostType).all()
    if not post_types:
        raise NotFoundException(detail="No post types found")
    return post_types