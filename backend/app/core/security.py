# from passlib.context import CryptContext
# from jose import jwt
# from datetime import datetime, timedelta

# SECRET_KEY = "CHANGE_ME"
# ALGORITHM = "HS256"
# EXPIRE_MIN = 60

# pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def hash_password(password: str) -> str:
#     return pwd.hash(password)

# def verify_password(password: str, hashed: str) -> bool:
#     return pwd.verify(password, hashed)

# def create_access_token(user_id: int):
#     payload = {
#         "sub": user_id,
#         "exp": datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
#     }
#     return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


from datetime import datetime, timedelta
from typing import Optional

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(
    subject: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    to_encode = subject.copy()

    expire = datetime.utcnow() + (
        expires_delta
        if expires_delta
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
