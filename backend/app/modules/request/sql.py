from app.db.mysql import get_conn, release_conn
from typing import Optional
from datetime import date, datetime


def get_requests():
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, request_date, request_created_at, request_code, 
                       request_customer, project_name, location, site_address, 
                       service_name, service_type, customer_data
                FROM service_requests
                ORDER BY id DESC
                """
            )
            return cur.fetchall()
    finally:
        release_conn(conn)


def get_request_by_id(request_id: int):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, request_date, request_created_at, request_code, 
                       request_customer, project_name, location, site_address, 
                       service_name, service_type, customer_data
                FROM service_requests
                WHERE id = %s
                """,
                (request_id,),
            )
            return cur.fetchone()
    finally:
        release_conn(conn)


def create_request(
    request_date: Optional[date] = None,
    request_created_at: Optional[datetime] = None,
    request_code: Optional[str] = None,
    request_customer: Optional[str] = None,
    project_name: Optional[str] = None,
    location: Optional[str] = None,
    site_address: Optional[str] = None,
    service_name: Optional[str] = None,
    service_type: Optional[int] = None,
    customer_data: Optional[str] = None,
):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO service_requests (
                    request_date, request_created_at, request_code, 
                    request_customer, project_name, location, site_address, 
                    service_name, service_type, customer_data
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    request_date,
                    request_created_at,
                    request_code,
                    request_customer,
                    project_name,
                    location,
                    site_address,
                    service_name,
                    service_type,
                    customer_data,
                ),
            )
            conn.commit()
            return cur.lastrowid
    finally:
        release_conn(conn)


def update_request(
    request_id: int,
    request_date: Optional[date] = None,
    request_created_at: Optional[datetime] = None,
    request_code: Optional[str] = None,
    request_customer: Optional[str] = None,
    project_name: Optional[str] = None,
    location: Optional[str] = None,
    site_address: Optional[str] = None,
    service_name: Optional[str] = None,
    service_type: Optional[int] = None,
    customer_data: Optional[str] = None,
):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE service_requests
                SET request_date = %s, request_created_at = %s, request_code = %s, 
                    request_customer = %s, project_name = %s, location = %s, 
                    site_address = %s, service_name = %s, service_type = %s, 
                    customer_data = %s
                WHERE id = %s
                """,
                (
                    request_date,
                    request_created_at,
                    request_code,
                    request_customer,
                    project_name,
                    location,
                    site_address,
                    service_name,
                    service_type,
                    customer_data,
                    request_id,
                ),
            )
            conn.commit()
            return True
    finally:
        release_conn(conn)


def delete_request(request_id: int):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM service_requests
                WHERE id = %s
                """,
                (request_id,),
            )
            conn.commit()
            return True
    finally:
        release_conn(conn)
