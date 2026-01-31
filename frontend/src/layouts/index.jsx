import { ProLayout } from '@ant-design/pro-components'
import { Button, Result } from 'antd'
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../assets/cube.svg'

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
	return (
		<ProLayout
			title="LIMS"
			logo={Logo}
		// location={{
		// 	pathname: location.pathname,
		// }}
		>
		</ProLayout>
	)
}

export default Layout