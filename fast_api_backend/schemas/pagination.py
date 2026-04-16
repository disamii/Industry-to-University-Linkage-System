from fastapi_pagination import Page
from pydantic import BaseModel
from fastapi_pagination import Params  # ✅ correct
from typing import Generic, TypeVar, Sequence, Optional
from .schemas import *

class IndustryRequestStats(BaseModel):
    total_requests: int
    pending_count: int
    active_count: int
    high_priority: int


class IndustryRequestPage(Page[IndustryRequest]):
    statistics: IndustryRequestStats
    
    



T = TypeVar("T")

class PostPage(Page[T], Generic[T]):
    total_posts: int = 0
    published_count: int = 0
    draft_count: int = 0

    @classmethod
    def create(
        cls,
        items: Sequence[T],
        params: Params,
        total: int,
        **kwargs
    ):
        return cls(
            items=items,
            total=total,
            page=params.page,
            size=params.size,
            pages=(total + params.size - 1) // params.size,
            total_posts=kwargs.get("total_posts", 0),
            published_count=kwargs.get("published_count", 0),
            draft_count=kwargs.get("draft_count", 0),
        )

class IndustryRequestPage(Page[T], Generic[T]):
    total_requests: int = 0
    pending_count: int = 0
    completed_count: int = 0

    @classmethod
    def create(cls, items: Sequence[T], params: Params, total: int, **kwargs):
        return cls(
            items=items,
            total=total,
            page=params.page,
            size=params.size,
            pages=(total + params.size - 1) // params.size,
            total_requests=kwargs.get("total_requests", 0),
            pending_count=kwargs.get("pending_count", 0),
            completed_count=kwargs.get("completed_count", 0),
        )