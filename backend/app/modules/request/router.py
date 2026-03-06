from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime

from app.modules.request import sql, schemas

router = APIRouter(prefix="/requests", tags=["Requests"])


def get_request_or_404(request_id: int):
    request = sql.get_request_by_id(request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    return request


@router.get("/generate-code")
def generate_request_code(service_type: int = 1):
    next_id = sql.get_max_request_id() + 1
    today_str = datetime.now().strftime("%Y%m%d")
    return {"code": f"{service_type}{today_str}{next_id:04d}"}


@router.get("/", response_model=List[schemas.ServiceRequest])
def read_requests():
    return sql.get_requests()


@router.get("/{request_id}", response_model=schemas.ServiceRequest)
def read_request(request=Depends(get_request_or_404)):
    return request


@router.post("/", response_model=schemas.ServiceRequest)
def create_request(request_data: schemas.ServiceRequestCreate):
    request_id = sql.create_request(**request_data.model_dump())
    return sql.get_request_by_id(request_id)


@router.put("/{request_id}", response_model=schemas.ServiceRequest)
def update_request(
    request_id: int,
    request_data: schemas.ServiceRequestUpdate,
    request=Depends(get_request_or_404),
):
    if not sql.update_request(request_id=request_id, **request_data.model_dump()):
        raise HTTPException(status_code=400, detail="Failed to update request")
    return sql.get_request_by_id(request_id)


@router.delete("/{request_id}")
def delete_request(request_id: int, request=Depends(get_request_or_404)):
    if not sql.delete_request(request_id):
        raise HTTPException(status_code=400, detail="Failed to delete request")
    return {"message": "Request deleted successfully"}
