import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '@/utils/auth'
import { useQuery } from '@tanstack/react-query'
import { apiMe } from '@/api/auth.api'
import { Spin } from 'antd'

const RequireAuth = ({ children, blockRoles = [] }) => {
	const location = useLocation()

	if (!isAuthenticated()) {
		return (
			<Navigate
				to="/login"
				replace
				state={{ from: location }}
			/>
		)
	}

	const { data: user, isLoading } = useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const res = await apiMe()
			return res.data
		},
		staleTime: 1000 * 60 * 5, // cache for 5 minutes
	})

	if (isLoading) {
		return <div className="flex w-full h-[60vh] justify-center items-center"><Spin size="large" /></div>
	}

	if (user && blockRoles.length > 0 && blockRoles.includes(user.role)) {
		return <Navigate to="/" replace />
	}

	return children
}

export default RequireAuth
