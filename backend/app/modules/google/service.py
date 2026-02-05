import os
import gspread
from oauth2client.service_account import ServiceAccountCredentials

scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

# 1. Định nghĩa các đường dẫn có thể xảy ra
RENDER_SECRET_PATH = "/etc/secrets/credentials.json"
LOCAL_PATH = "app/modules/google/credentials.json"

# 2. Kiểm tra xem file nằm ở đâu để gán đường dẫn chính xác
if os.path.exists(RENDER_SECRET_PATH):
    path_to_use = RENDER_SECRET_PATH
elif os.path.exists(LOCAL_PATH):
    path_to_use = LOCAL_PATH
else:
    # Nếu không tìm thấy ở cả 2 nơi, báo lỗi rõ ràng để bạn dễ debug
    raise FileNotFoundError(
        f"Không tìm thấy credentials.json tại {LOCAL_PATH} hoặc {RENDER_SECRET_PATH}"
    )

# 3. Khởi tạo credentials với đường dẫn đã tìm thấy
creds = ServiceAccountCredentials.from_json_keyfile_name(path_to_use, scopes)

client = gspread.authorize(creds)


async def get_sheets():
    # Mở file Google Sheet và lấy dữ liệu
    return client.open("DATA_FORM").sheet1.get_all_records()
