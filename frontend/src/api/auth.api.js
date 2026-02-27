import http from "./http"

export const apiLogin = (payload) => {
    return http.post("/api/v1/auth/login", payload)
}

export const apiMe = () => {
    return http.get("/api/v1/auth/me")
}

export const apiRegister = (payload) => {
    return http.post("/api/v1/auth/register", payload)
}

export const apiChangePassword = (payload) => {
    return http.put("/api/v1/auth/change-password", payload)
}
