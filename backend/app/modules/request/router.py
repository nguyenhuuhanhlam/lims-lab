from fastapi import APIRouter, HTTPException
from typing import List

from app.modules.request import sql, schemas

router = APIRouter(prefix="/requests", tags=["Requests"])


@router.get("/", response_model=List[schemas.ServiceRequest])
def read_requests():
    requests = sql.get_requests()
    return requests


@router.get("/{request_id}", response_model=schemas.ServiceRequest)
def read_request(request_id: int):
    request = sql.get_request_by_id(request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    return request


@router.post("/", response_model=schemas.ServiceRequest)
def create_request(request_data: schemas.ServiceRequestCreate):
    request_id = sql.create_request(**request_data.model_dump())
    new_request = sql.get_request_by_id(request_id)
    return new_request


@router.put("/{request_id}", response_model=schemas.ServiceRequest)
def update_request(request_id: int, request_data: schemas.ServiceRequestUpdate):
    existing = sql.get_request_by_id(request_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Request not found")

    success = sql.update_request(request_id=request_id, **request_data.model_dump())
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update request")

    updated_request = sql.get_request_by_id(request_id)
    return updated_request


@router.delete("/{request_id}")
def delete_request(request_id: int):
    existing = sql.get_request_by_id(request_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Request not found")

    success = sql.delete_request(request_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to delete request")

    return {"message": "Request deleted successfully"}
