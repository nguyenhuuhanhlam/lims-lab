import { getToken } from './token'

export const isAuthenticated = () => {
    return !!getToken()
}
