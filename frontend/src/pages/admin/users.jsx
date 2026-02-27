import { useRef, useState } from 'react';
import { Button, message, Popconfirm, Tag, Modal, Form, Input, Select, Switch } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from '@/api/auth.api';

const Users = () => {
	const actionRef = useRef();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [form] = Form.useForm();

	const handleEdit = (record) => {
		setEditingUser(record);
		setIsModalOpen(true);
		setTimeout(() => {
			form.setFieldsValue({
				full_name: record.full_name,
				email: record.email,
				role: record.role,
				is_active: record.is_active,
			});
		}, 0);
	};

	const handleDelete = async (id) => {
		try {
			await apiDeleteUser(id);
			message.success('User deleted successfully');
			actionRef.current?.reload();
		} catch (error) {
			message.error('Failed to delete user');
		}
	};

	const handleUpdate = async (values) => {
		try {
			await apiUpdateUser(editingUser.id, values);
			message.success('User updated successfully');
			setIsModalOpen(false);
			actionRef.current?.reload();
		} catch (error) {
			message.error('Failed to update user');
		}
	};

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			search: false,
			width: 60,
		},
		{
			title: 'Username',
			dataIndex: 'username',
		},
		{
			title: 'Full Name',
			dataIndex: 'full_name',
			search: false,
		},
		{
			title: 'Role',
			dataIndex: 'role',
			valueType: 'select',
			valueEnum: {
				admin: { text: 'Admin', status: 'Error' },
				manager: { text: 'Manager', status: 'Processing' },
				client: { text: 'Client', status: 'Default' },
			},
		},
		{
			title: 'Status',
			dataIndex: 'is_active',
			search: false,
			render: (_, record) => (
				<Tag color={record.is_active ? 'green' : 'red'}>
					{record.is_active ? 'Active' : 'Inactive'}
				</Tag>
			),
		},
		{
			title: 'Actions',
			valueType: 'option',
			width: 120,
			render: (text, record) => [
				<Button
					key="edit"
					type="text"
					icon={<IconEdit size={18} />}
					onClick={() => handleEdit(record)}
				/>,
				<Popconfirm
					key="delete"
					title="Delete user"
					description="Are you sure you want to delete this user?"
					onConfirm={() => handleDelete(record.id)}
					okText="Yes"
					cancelText="No"
					disabled={record.username === 'admin'}
				>
					<Button type="text" danger icon={<IconTrash size={18} />} disabled={record.username === 'admin'} />
				</Popconfirm>,
			],
		},
	];

	return (
		<div className="p-6">
			<ProTable
				columns={columns}
				actionRef={actionRef}
				cardBordered
				request={async (params) => {
					// NOTE: Ensure your apiGetUsers handles pagination if needed
					// For now, assuming it returns the full array or formatted data
					try {
						const res = await apiGetUsers();
						const data = res.data?.items || res.data || [];
						return {
							data: data,
							success: true,
							total: data.length,
						};
					} catch (error) {
						return { success: false };
					}
				}}
				rowKey="id"
				search={false}
				options={{
					setting: {
						listsHeight: 400,
					},
				}}
				pagination={{
					pageSize: 10,
				}}
				dateFormatter="string"
				headerTitle="User Management"
			/>

			<Modal
				title="Edit User"
				open={isModalOpen}
				onOk={form.submit}
				onCancel={() => setIsModalOpen(false)}
				destroyOnHidden
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleUpdate}
				>
					<Form.Item
						name="full_name"
						label="Full Name"
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						rules={[
							{ type: 'email', message: 'The input is not valid E-mail!' }
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="role"
						label="Role"
						rules={[{ required: true, message: 'Please select a role' }]}
					>
						<Select
							options={[
								{ value: 'admin', label: 'Admin' },
								{ value: 'manager', label: 'Manager' },
								{ value: 'client', label: 'Client' },
							]}
						/>
					</Form.Item>
					<Form.Item
						name="is_active"
						label="Status"
						valuePropName="checked"
					>
						<Switch checkedChildren="Active" unCheckedChildren="Inactive" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default Users;
