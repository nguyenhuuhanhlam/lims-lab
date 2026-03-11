import { useRef, useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { IconEdit, IconTrash, IconPrinter } from '@tabler/icons-react';
import { apiGetRequests, apiCreateRequest, apiUpdateRequest, apiDeleteRequest } from '@/api/request.api';
import { printRequestSlip } from './print-slip';
import RequestSlipModal from './request-slip-modal';

const RequestSlips = () => {
	const actionRef = useRef();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingSlip, setEditingSlip] = useState(null);

	const handleAdd = () => {
		setEditingSlip(null);
		setIsModalOpen(true);
	};

	const handleEdit = (record) => {
		setEditingSlip(record);
		setIsModalOpen(true);
	};

	const handleDelete = async (id) => {
		try {
			await apiDeleteRequest(id);
			message.success('Slip deleted successfully');
			actionRef.current?.reload();
		} catch {
			message.error('Failed to delete slip');
		}
	};

	const handleSave = async (values, taskDataSource) => {
		try {
			const taskDataStr = taskDataSource.length > 0 ? JSON.stringify(taskDataSource) : null;

			let finalRequestData = null;
			if (values.request_data) {
				const str = values.request_data.trim();
				if (str) {
					try {
						JSON.parse(str);
						finalRequestData = str;
					} catch {
						finalRequestData = JSON.stringify(str);
					}
				}
			}

			const payload = {
				...values,
				request_date: values.request_date ? values.request_date.format('YYYY-MM-DD') : null,
				task_data: taskDataStr,
				request_data: finalRequestData,
			};

			if (editingSlip) {
				await apiUpdateRequest(editingSlip.id, payload);
				message.success('Slip updated successfully');
			} else {
				await apiCreateRequest(payload);
				message.success('Slip created successfully');
			}
			setIsModalOpen(false);
			actionRef.current?.reload();
		} catch {
			message.error('Failed to save slip');
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
			title: 'Request Code',
			dataIndex: 'request_code',
		},
		{
			title: 'Customer',
			dataIndex: 'request_customer',
		},
		{
			title: 'Project',
			dataIndex: 'project_name',
			search: false,
		},
		{
			title: 'Service',
			dataIndex: 'service_name',
			search: false,
		},
		{
			title: 'Request Date',
			dataIndex: 'request_date',
			valueType: 'date',
			search: false,
		},
		{
			title: 'Actions',
			valueType: 'option',
			width: 150,
			render: (text, record) => [
				<Button
					key="edit"
					type="text"
					icon={<IconEdit size={18} />}
					onClick={() => handleEdit(record)}
				/>,
				<Popconfirm
					key="delete"
					title="Delete slip"
					description="Are you sure you want to delete this slip?"
					onConfirm={() => handleDelete(record.id)}
					okText="Yes"
					cancelText="No"
				>
					<Button type="text" danger icon={<IconTrash size={18} />} />
				</Popconfirm>,
				<Button
					key="print"
					type="text"
					icon={<IconPrinter size={18} />}
					onClick={() => printRequestSlip(record)}
				/>
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
					try {
						const res = await apiGetRequests();
						let data = Array.isArray(res.data) ? res.data : (res.data?.items || []);
						// Client-side search for simplicity matching ProTable 'search'
						if (params.request_code) {
							data = data.filter(item => item.request_code?.includes(params.request_code));
						}
						if (params.request_customer) {
							data = data.filter(item => item.request_customer?.toLowerCase().includes(params.request_customer.toLowerCase()));
						}
						return {
							data: data,
							success: true,
							total: data.length,
						};
					} catch {
						return { success: false };
					}
				}}
				rowKey="id"
				search={{
					labelWidth: 'auto',
				}}
				options={{
					setting: {
						listsHeight: 400,
					},
				}}
				pagination={{
					pageSize: 10,
				}}
				dateFormatter="string"
				headerTitle="Request Slips Management"
				toolBarRender={() => [
					<Button key="button" icon={<IconEdit size={16} />} type="primary" onClick={handleAdd}>
						Create New
					</Button>,
				]}
			/>

			<RequestSlipModal
				open={isModalOpen}
				editingSlip={editingSlip}
				onCancel={() => setIsModalOpen(false)}
				onSubmit={handleSave}
			/>
		</div>
	);
};

export default RequestSlips;
