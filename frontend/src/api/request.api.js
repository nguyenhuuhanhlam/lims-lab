import http from './http'

export const apiGenerateRequestCode = (serviceType = 1) => {
	return http.get(`/api/v1/requests/generate-code?service_type=${serviceType}`)
}

export const apiGetRequests = () => {
	return http.get('/api/v1/requests/')
}

export const apiGetRequest = (id) => {
	return http.get(`/api/v1/requests/${id}`)
}

export const apiCreateRequest = (data) => {
	return http.post('/api/v1/requests/', data)
}

export const apiUpdateRequest = (id, data) => {
	return http.put(`/api/v1/requests/${id}`, data)
}

export const apiDeleteRequest = (id) => {
	return http.delete(`/api/v1/requests/${id}`)
}
