import { Modal, Form, Input, App } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { apiChangePassword } from '@/api/auth.api'

const ChangePasswordModal = ({ open, onCancel }) => {
	const [form] = Form.useForm()
	const { message } = App.useApp()

	const mutation = useMutation({
		mutationFn: apiChangePassword,
		onSuccess: () => {
			message.success('Password changed successfully')
			form.resetFields()
			onCancel()
		},
		onError: (error) => {
			message.error(error?.response?.data?.detail || 'Failed to change password')
		}
	})

	const handleOk = async () => {
		try {
			const values = await form.validateFields()
			mutation.mutate({
				old_password: values.oldPassword,
				new_password: values.newPassword,
			})
		} catch (error) {
			// Form validation failed
		}
	}

	return (
		<Modal
			title="Change Password"
			open={open}
			onOk={handleOk}
			onCancel={() => {
				form.resetFields()
				onCancel()
			}}
			confirmLoading={mutation.isPending}
			destroyOnClose
		>
			<Form form={form} layout="vertical">
				<Form.Item
					name="oldPassword"
					label="Current Password"
					rules={[{ required: true, message: 'Please input your current password!' }]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					name="newPassword"
					label="New Password"
					rules={[
						{ required: true, message: 'Please input your new password!' },
						{ min: 6, message: 'Password must be at least 6 characters!' }
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					name="confirmPassword"
					label="Confirm New Password"
					dependencies={['newPassword']}
					rules={[
						{ required: true, message: 'Please confirm your new password!' },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('newPassword') === value) {
									return Promise.resolve()
								}
								return Promise.reject(new Error('The new passwords that you entered do not match!'))
							},
						}),
					]}
				>
					<Input.Password />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default ChangePasswordModal
