import { ProLayout } from '@ant-design/pro-components'
import { Button, Result } from 'antd'
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom'

const Layout = () => {
	return (
<ProLayout
			title={<span className="text-xs font-normal px-2">LIMS</span>}
			// logo={Logo}
			// location={{
			// 	pathname: location.pathname,
			// }}
		>
		</ProLayout>
		)
}

export default Layout