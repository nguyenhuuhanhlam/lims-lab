import { useState } from 'react';
import { Button, DatePicker, Form, Input, Modal } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';

const ContractRequestTab = ({ taskDataSource, setTaskDataSource }) => {
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [editingTaskIndex, setEditingTaskIndex] = useState(null);
	const [taskForm] = Form.useForm();

	const handleCloseTaskModal = () => {
		setIsTaskModalOpen(false);
		setEditingTaskIndex(null);
		taskForm.resetFields();
	};

	const handleSaveTask = (values) => {
		const formattedTask = {
			...values,
			return_date: values.return_date ? values.return_date.format('YYYY-MM-DD') : null
		};

		if (editingTaskIndex !== null) {
			setTaskDataSource((prev) => {
				const nextData = [...prev];
				nextData[editingTaskIndex] = formattedTask;
				return nextData;
			});
		} else {
			setTaskDataSource((prev) => [...prev, formattedTask]);
		}

		handleCloseTaskModal();
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
		setTaskDataSource((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
	};

	return (
		<div className="space-y-4">
			<div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
				<div className="font-medium">Contract Request</div>
				<div className="mt-1 text-amber-800">
					Prepare a contract-based request for longer or formal service engagements.
				</div>
			</div>
			<div className="grid grid-cols-2 gap-x-4">
				<Form.Item name="request_code" label="Request Code" style={{ marginBottom: 12 }}>
					<Input />
				</Form.Item>
				<Form.Item name="request_date" label="Request Date" style={{ marginBottom: 12 }}>
					<DatePicker className="w-full" format="YYYY-MM-DD" />
				</Form.Item>
				<Form.Item name="request_customer" label="Customer" style={{ marginBottom: 12 }}>
					<Input />
				</Form.Item>
				<Form.Item name="project_name" label="Project" style={{ marginBottom: 12 }}>
					<Input />
				</Form.Item>
				<Form.Item name="location" label="Location" style={{ marginBottom: 12 }}>
					<Input />
				</Form.Item>
				<Form.Item name="site_address" label="Address" style={{ marginBottom: 12 }}>
					<Input />
				</Form.Item>
				<Form.Item name="service_name" label="Service" style={{ marginBottom: 12 }}>
					<Input />
				</Form.Item>
				<Form.Item name="request_data" label="Data" className="col-span-2" style={{ marginBottom: 12 }}>
					<Input.TextArea rows={3} />
				</Form.Item>
			</div>
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
								<Button
									key="edit"
									type="text"
									icon={<IconEdit size={16} />}
									onClick={() => handleEditTask(record, index)}
								/>,
								<Button
									key="delete"
									type="text"
									danger
									icon={<IconTrash size={16} />}
									onClick={() => handleDeleteTask(index)}
								/>
							]
						}
					]}
					dataSource={taskDataSource}
					rowKey={(record, index) => index ?? record.material_type}
					search={false}
					options={false}
					pagination={false}
					toolBarRender={() => [
						<Button
							key="add"
							icon={<IconPlus size={16} />}
							type="primary"
							size="small"
							onClick={() => {
								setEditingTaskIndex(null);
								taskForm.resetFields();
								setIsTaskModalOpen(true);
							}}
						>
							Add Task
						</Button>
					]}
				/>
			</div>

			<Modal
				title={<span className="text-sm">{editingTaskIndex !== null ? 'Edit Task' : 'Create Task'}</span>}
				open={isTaskModalOpen}
				onOk={taskForm.submit}
				onCancel={handleCloseTaskModal}
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

export default ContractRequestTab;
