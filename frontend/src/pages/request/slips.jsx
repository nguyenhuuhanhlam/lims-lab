import { useRef, useState } from 'react';
import { Button, message, Popconfirm, Modal, Form, Input, DatePicker, Tabs } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { IconEdit, IconTrash, IconPrinter, IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { apiGetRequests, apiCreateRequest, apiUpdateRequest, apiDeleteRequest, apiGenerateRequestCode } from '@/api/request.api';
import { printRequestSlip } from './print-slip';
import SlipRequestTab from './service-type-tabs/slip-request-tab';
import ContractRequestTab from './service-type-tabs/contract-request-tab';

const SERVICE_TYPE_TABS = [
	{
		key: '1',
		label: 'Slip Request',
		content: <SlipRequestTab />
	},
	{
		key: '2',
		label: 'Contract Request',
		content: <ContractRequestTab />
	}
];

const RequestSlips = () => {
	const actionRef = useRef();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingSlip, setEditingSlip] = useState(null);
	const [activeServiceType, setActiveServiceType] = useState('1');
	const [form] = Form.useForm();

	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [taskForm] = Form.useForm();
	const [taskDataSource, setTaskDataSource] = useState([]);
	const [editingTaskIndex, setEditingTaskIndex] = useState(null);

	const handleAdd = async () => {
		setEditingSlip(null);
		setTaskDataSource([]);
		form.resetFields();
		setIsModalOpen(true);
		setActiveServiceType('1');
		try {
			const res = await apiGenerateRequestCode(1);
			form.setFieldsValue({
				request_code: res.data.code,
				service_type: 1
			});
		} catch (error) {
			console.error('Failed to generate code:', error);
		}
	};

	const handleEdit = (record) => {
		setEditingSlip(record);
		setIsModalOpen(true);
		setActiveServiceType(String(record.service_type || 1));
		setTimeout(() => {
			let taskData = [];
			if (record.task_data) {
				try {
					taskData = JSON.parse(record.task_data);
				} catch (e) { }
			}
			setTaskDataSource(taskData);

			let requestDataFormValue = record.request_data;
			if (record.request_data) {
				try {
					let parsed = JSON.parse(record.request_data);
					if (typeof parsed === 'string') {
						requestDataFormValue = parsed;
					} else {
						requestDataFormValue = JSON.stringify(parsed, null, 2);
					}
				} catch (e) { }
			}

			form.setFieldsValue({
				...record,
				request_data: requestDataFormValue,
				request_date: record.request_date ? dayjs(record.request_date) : null,
			});
		}, 0);
	};

	const handleDelete = async (id) => {
		try {
			await apiDeleteRequest(id);
			message.success('Slip deleted successfully');
			actionRef.current?.reload();
		} catch (error) {
			message.error('Failed to delete slip');
		}
	};

	const handleServiceTypeChange = (val) => {
		setActiveServiceType(String(val));
		const currentCode = form.getFieldValue('request_code');
		form.setFieldsValue({ service_type: val });
		if (currentCode && currentCode.length > 0) {
			form.setFieldsValue({
				request_code: val + currentCode.substring(1)
			});
		}
	};

	const handleSave = async (values) => {
		try {

			const taskDataStr = taskDataSource.length > 0 ? JSON.stringify(taskDataSource) : null;

			let finalRequestData = null;
			if (values.request_data) {
				let str = values.request_data.trim();
				if (str) {
					try {
						JSON.parse(str);
						finalRequestData = str; // already valid JSON
					} catch (e) {
						finalRequestData = JSON.stringify(str); // wrap plain text in JSON string
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
		} catch (error) {
			message.error('Failed to save slip');
		}
	};

	const handleSaveTask = (values) => {
		const formattedTask = {
			...values,
			return_date: values.return_date ? values.return_date.format('YYYY-MM-DD') : null
		};
		if (editingTaskIndex !== null) {
			const newData = [...taskDataSource];
			newData[editingTaskIndex] = formattedTask;
			setTaskDataSource(newData);
		} else {
			setTaskDataSource([...taskDataSource, formattedTask]);
		}
		setIsTaskModalOpen(false);
	};

	const handleEditTask = (record, index) => {
		setEditingTaskIndex(index);
		taskForm.setFieldsValue({
			...record,
			return_date: record.return_date ? dayjs(record.return_date) : null
		});
		setIsTaskModalOpen(true);
	};

	const handleDeleteTask = (index) => {
		setTaskDataSource(prev => prev.filter((_, i) => i !== index));
	};

	const activeTabContent =
		SERVICE_TYPE_TABS.find((item) => item.key === activeServiceType)?.content ?? <SlipRequestTab />;



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
					} catch (error) {
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

			<Modal
				title={<span className="text-sm">{editingSlip ? "Edit Slip" : "Create Slip"}</span>}
				open={isModalOpen}
				onOk={form.submit}
				onCancel={() => setIsModalOpen(false)}
				destroyOnHidden
				width={800}
				okButtonProps={{ size: 'small' }}
				cancelButtonProps={{ size: 'small' }}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSave}
					size="small"
					className="text-sm"
				>
					<Form.Item name="service_type" hidden>
						<Input />
					</Form.Item>
					<Tabs
						activeKey={activeServiceType}
						items={SERVICE_TYPE_TABS.map(({ key, label }) => ({ key, label }))}
						onChange={(key) => handleServiceTypeChange(Number(key))}
						className="mb-4"
					/>
					{activeTabContent}

					<div className="mt-6 border-t pt-4">
						<h3 className="mb-4 text-lg font-medium">Task List</h3>
						<ProTable
							columns={[
								{ title: 'Material Type', dataIndex: 'material_type' },
								{ title: 'Unit', dataIndex: 'unit' },
								{ title: 'Quantity', dataIndex: 'quantity' },
								{ title: 'Return Date', dataIndex: 'return_date', valueType: 'date' },
								{ title: 'Request Content', dataIndex: 'request_content' },
								{
									title: 'Actions',
									valueType: 'option',
									width: 100,
									render: (text, record, index) => [
										<Button key="edit" type="text" icon={<IconEdit size={16} />} onClick={() => handleEditTask(record, index)} />,
										<Button key="delete" type="text" danger icon={<IconTrash size={16} />} onClick={() => handleDeleteTask(index)} />
									]
								}
							]}
							dataSource={taskDataSource}
							rowKey={(record, index) => index}
							search={false}
							options={false}
							pagination={false}
							toolBarRender={() => [
								<Button key="add" icon={<IconPlus size={16} />} type="primary" size="small" onClick={() => {
									setEditingTaskIndex(null);
									taskForm.resetFields();
									setIsTaskModalOpen(true);
								}}>
									Add Task
								</Button>
							]}
						/>
					</div>
				</Form>
			</Modal>

			<Modal
				title={<span className="text-sm">{editingTaskIndex !== null ? "Edit Task" : "Create Task"}</span>}
				open={isTaskModalOpen}
				onOk={taskForm.submit}
				onCancel={() => setIsTaskModalOpen(false)}
				destroyOnHidden
				okButtonProps={{ size: 'small' }}
				cancelButtonProps={{ size: 'small' }}
			>
				<Form form={taskForm} layout="vertical" onFinish={handleSaveTask} size="small" className="text-sm">
					<div className="grid grid-cols-2 gap-x-4">
						<Form.Item name="material_type" label="Material Type" style={{ marginBottom: 12 }}>
							<Input placeholder="Enter material type" />
						</Form.Item>
						<Form.Item name="unit" label="Unit" style={{ marginBottom: 12 }}>
							<Input placeholder="E.g., Box, Bottle, Kg..." />
						</Form.Item>
						<Form.Item name="quantity" label="Quantity" style={{ marginBottom: 12 }}>
							<Input placeholder="Enter quantity" />
						</Form.Item>
						<Form.Item name="return_date" label="Return Date" style={{ marginBottom: 12 }}>
							<DatePicker className="w-full" format="YYYY-MM-DD" placeholder="Select date" />
						</Form.Item>
						<Form.Item name="request_content" label="Request Content" className="col-span-2" style={{ marginBottom: 12 }}>
							<Input.TextArea rows={2} placeholder="Enter specific request content..." />
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default RequestSlips;
