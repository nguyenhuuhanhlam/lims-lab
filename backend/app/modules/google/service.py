import gspread
from oauth2client.service_account import ServiceAccountCredentials

scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

creds = ServiceAccountCredentials.from_json_keyfile_name(
    "app/modules/google/credentials.json", scopes
)

client = gspread.authorize(creds)


async def get_sheets():
    return client.open("DATA_FORM").sheet1.get_all_records()
