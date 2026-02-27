import { Descriptions, Button, Card } from 'antd'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageContainer } from '@ant-design/pro-components'
import ChangePasswordModal from './change-password-modal'
import { apiMe } from '@/api/auth.api'
import { getToken } from '@/utils/token'

const UserProfilePage = () => {
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

	const { data: user, isLoading } = useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const res = await apiMe()
			return res.data
		},
		enabled: !!getToken(),
	})

	if (isLoading) {
		return <PageContainer><Card loading={true} /></PageContainer>
	}

	if (!user) return <PageContainer><div>Please log in</div></PageContainer>

	return (
		<PageContainer title="User Profile">
			<Card>
				<Descriptions column={1} bordered size="middle">
					<Descriptions.Item label="Username">{user.username}</Descriptions.Item>
					<Descriptions.Item label="Full Name">{user.full_name || 'N/A'}</Descriptions.Item>
					<Descriptions.Item label="Email">{user.email || 'N/A'}</Descriptions.Item>
					<Descriptions.Item label="Role">{user.role}</Descriptions.Item>
				</Descriptions>
				<div className="mt-4">
					<Button type="primary" onClick={() => setIsChangePasswordOpen(true)}>
						Change Password
					</Button>
				</div>
			</Card>

			<ChangePasswordModal
				open={isChangePasswordOpen}
				onCancel={() => setIsChangePasswordOpen(false)}
			/>
		</PageContainer>
	)
}

export default UserProfilePage
