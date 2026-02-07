import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom'
import { Suspense } from 'react'
import { ProLayout } from '@ant-design/pro-components'
import { Button, Dropdown, Result, Avatar, message } from 'antd'
import { FrownOutlined, HomeFilled } from '@ant-design/icons'

import route_config from '../routes'
import RequireAuth from '@/pages/auth/require-auth'
import { clearToken } from '@/utils/token'
import Login from '@/pages/auth/login'
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

	const handleLogout = async () => {
		try {
			// optional: await apiLogout()
		} finally {
			clearToken()
			message.success("Logged out successfully")
			navigate('/login', { replace: true })
		}
	}

	return (
		<ProLayout
			{...layout_props}

			title="LIMS"
			logo={Logo}

			location={{
				pathname: location.pathname,
			}}
			route={route_config.route}

			menuItemRender={(item, dom) => (
				<Link to={item.path || '/'}>{dom}</Link>
			)}

			avatarProps={{
				src: <Avatar />,
				title: 'Guest',
				render: (props, dom) => {
					return (
						<>
							<Dropdown
								menu={{
									items: [
										{ key: '1', label: 'Profile' },
										{ key: '2', label: 'Logout', onClick: handleLogout },
									]
								}}
							>
								{dom}
							</Dropdown>
						</>
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
									? <RequireAuth>{element}</RequireAuth>
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