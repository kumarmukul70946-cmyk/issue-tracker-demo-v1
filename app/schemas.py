from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# --- Users ---
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    pass

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True

# --- Labels ---
class LabelBase(BaseModel):
    name: str

class LabelCreate(LabelBase):
    pass

class LabelOut(LabelBase):
    id: int
    class Config:
        orm_mode = True

# --- Comments ---
class CommentBase(BaseModel):
    body: str

class CommentCreate(CommentBase):
    author_id: int # In a real app, this would come from auth token

class CommentOut(CommentBase):
    id: int
    issue_id: int
    author_id: int
    created_at: datetime
    author: UserOut
    class Config:
        orm_mode = True

# --- Issues ---
class IssueBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "open"
    assignee_id: Optional[int] = None

class IssueCreate(IssueBase):
    pass

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assignee_id: Optional[int] = None
    version: int # Required for optimistic locking check

class IssueOut(IssueBase):
    id: int
    version: int
    created_at: datetime
    resolved_at: Optional[datetime]
    assignee: Optional[UserOut]
    labels: List[LabelOut] = []
    comments: List[CommentOut] = [] # Optional, might not want to load always

    class Config:
        orm_mode = True

class BulkStatusUpdate(BaseModel):
    issue_ids: List[int]
    status: str

class HistoryOut(BaseModel):
    id: int
    issue_id: int
    event_type: str
    details: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True
