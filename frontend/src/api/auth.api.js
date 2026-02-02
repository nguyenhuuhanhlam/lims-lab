import http from "./http"

export const apiLogin = (payload) => {
    return http.post("/auth/login", payload)
}

export const apiMe = () => {
    return http.get("/auth/me")
}
