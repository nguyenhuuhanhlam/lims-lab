import http from './http'

export const apiGetRequests = () => {
	return http.get('/requests/')
}

export const apiGetRequest = (id) => {
	return http.get(`/requests/${id}`)
}

export const apiCreateRequest = (data) => {
	return http.post('/requests/', data)
}

export const apiUpdateRequest = (id, data) => {
	return http.put(`/requests/${id}`, data)
}

export const apiDeleteRequest = (id) => {
	return http.delete(`/requests/${id}`)
}
