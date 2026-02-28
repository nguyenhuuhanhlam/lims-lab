import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom'
import { Suspense } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ProLayout } from '@ant-design/pro-components'
import { Button, Dropdown, Result, Avatar, App } from 'antd'
import { FrownOutlined, HomeFilled } from '@ant-design/icons'

import RequireAuth from '@/pages/auth/require-auth'
import { clearToken, getToken } from '@/utils/token'
import Login from '@/pages/auth/login'
import { apiMe } from '@/api/auth.api'
import route_config from '../routes'
import { layout_props } from './config'
import Logo from '../assets/mtlab-logo.svg'


const getRoutes = (routes) => {
	let flatRoutes = []
	routes.forEach(item => {
		if (item.routes) {
			flatRoutes = [...flatRoutes, ...getRoutes(item.routes)]
		}
		if (item.component) {
			flatRoutes.push(item)
		}
	})
	return flatRoutes
}

const Layout = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const flatRoutes = getRoutes(route_config.route.routes)

	const queryClient = useQueryClient()
	const { message } = App.useApp()

	const { data: user } = useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const res = await apiMe()
			return res.data
		},
		enabled: !!getToken(),
	})

	const handleLogout = async () => {
		try {
			// optional: await apiLogout()
		} finally {
			clearToken()
			queryClient.removeQueries({ queryKey: ['currentUser'] })
			message.success("Logged out successfully")
			navigate('/login', { replace: true })
		}
	}

	return (
		<ProLayout
			{...layout_props}

			logo={Logo}

			location={{
				pathname: location.pathname,
			}}
			route={route_config.route}

			menuItemRender={(item, dom) => (
				<Link to={item.path || '/'}>{dom}</Link>
			)}

			postMenuData={(menuData) => {
				const filterMenu = (items) => {
					return items
						.filter(item => {
							if (user && item.blockRoles && item.blockRoles.includes(user.role)) {
								return false
							}
							return true
						})
						.map(item => {
							if (item.children) {
								return { ...item, children: filterMenu(item.children) }
							}
							return item
						})
				}
				return filterMenu(menuData)
			}}

			avatarProps={{
				src: <Avatar>{user?.username?.charAt(0).toUpperCase() || 'G'}</Avatar>,
				title: user?.username || 'Guest',
				render: (props, dom) => {
					if (!user) {
						return (
							<Dropdown
								menu={{
									items: [
										{ key: 'login', label: 'Login', onClick: () => navigate('/login') },
									]
								}}
								trigger={['click']}
							>
								<div className="w-full flex items-center justify-center overflow-hidden cursor-pointer">
									{dom}
								</div>
							</Dropdown>
						)
					}
					return (
						<Dropdown
							menu={{
								items: [
									{ key: 'profile', label: 'Profile', onClick: () => navigate('/profile') },
									{ key: 'logout', label: 'Logout', onClick: handleLogout },
								]
							}}
							trigger={['click']}
						>
							<div className="w-full flex items-center justify-center cursor-pointer">
								{dom}
							</div>
						</Dropdown>
					)
				}
			}}
		>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route
					path="/"
					element={
						<div className="flex">
							<Result
								title="Home"
								icon={<HomeFilled className="text-[32px]!" />}
								subTitle="Welcome to the app"
								extra={<Link to="/welcome"><Button type="primary">Go to Welcome</Button></Link>}
							/>
						</div>
					}
				/>

				{flatRoutes.map(item => {
					const Component = item.component

					const element = (
						<Suspense fallback={<div>Loading...</div>}>
							<Component />
						</Suspense>
					)

					return (
						<Route
							key={item.path}
							path={item.path}
							element={
								item.auth
									? <RequireAuth blockRoles={item.blockRoles}>{element}</RequireAuth>
									: element
							}
						/>
					)
				})}

				<Route
					path="*"
					element={
						<Result
							title="404"
							icon={<FrownOutlined />}
							subTitle="Sorry, the page you visited does not exist."
							extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
						/>
					}
				/>
			</Routes>
		</ProLayout>
	)
}

export default Layout