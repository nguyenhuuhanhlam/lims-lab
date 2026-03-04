import sys
import os

sys.path.append(r"c:\Devs\repos\lims-lab\backend")
from app.db.mysql import get_conn

try:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SHOW CREATE TABLE service_requests")
    print(cur.fetchone()[1])
finally:
    if "conn" in locals():
        conn.close()
