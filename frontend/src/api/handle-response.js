export const handleApi = async (promise) => {
    try {
        const res = await promise
        return [res.data, null]
    } catch (err) {
        const message =
            err.response?.data?.detail ||
            err.message ||
            "API error"
        return [null, message]
    }
}
