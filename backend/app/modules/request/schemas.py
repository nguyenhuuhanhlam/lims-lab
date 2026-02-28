from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class ServiceRequestBase(BaseModel):
    request_date: Optional[date] = None
    request_created_at: Optional[datetime] = None
    request_code: Optional[str] = None
    request_customer: Optional[str] = None
    project_name: Optional[str] = None
    location: Optional[str] = None
    site_address: Optional[str] = None
    service_name: Optional[str] = None
    service_type: Optional[int] = None
    customer_data: Optional[str] = None


class ServiceRequestCreate(ServiceRequestBase):
    pass


class ServiceRequestUpdate(ServiceRequestBase):
    pass


class ServiceRequest(ServiceRequestBase):
    id: int

    class Config:
        from_attributes = True
