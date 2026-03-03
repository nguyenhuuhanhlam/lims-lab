import { useRef, useState } from 'react';
import { Button, message, Popconfirm, Modal, Form, Input, DatePicker, Select, Space } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { IconEdit, IconTrash, IconPrinter } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { apiGetRequests, apiCreateRequest, apiUpdateRequest, apiDeleteRequest } from '@/api/request.api';

const RequestSlips = () => {
	const actionRef = useRef();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingSlip, setEditingSlip] = useState(null);
	const [form] = Form.useForm();

	const handleAdd = () => {
		setEditingSlip(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleEdit = (record) => {
		setEditingSlip(record);
		setIsModalOpen(true);
		setTimeout(() => {
			form.setFieldsValue({
				...record,
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

	const handleSave = async (values) => {
		try {
			const payload = {
				...values,
				request_date: values.request_date ? values.request_date.format('YYYY-MM-DD') : null,
			};

			if (editingSlip) {
				await apiUpdateRequest(editingSlip.id, payload);
				message.success('Slip updated successfully');
			} else {
				payload.request_created_at = new Date().toISOString();
				await apiCreateRequest(payload);
				message.success('Slip created successfully');
			}
			setIsModalOpen(false);
			actionRef.current?.reload();
		} catch (error) {
			message.error('Failed to save slip');
		}
	};

	const handlePrint = (record) => {
		// Create a temporary print window or write to current document then print
		const printContent = `
			<div style="font-family: Arial, sans-serif; padding: 20px;">
				<h1 style="text-align: center;">Service Request Slip - LIMS</h1>
				<hr />
				<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
					<tr>
						<th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 30%;">Request Code</th>
						<td style="border: 1px solid #ddd; padding: 8px;">${record.request_code || ''}</td>
					</tr>
					<tr>
						<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Request Date</th>
						<td style="border: 1px solid #ddd; padding: 8px;">${record.request_date || ''}</td>
					</tr>
					<tr>
						<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Customer</th>
						<td style="border: 1px solid #ddd; padding: 8px;">${record.request_customer || ''}</td>
					</tr>
					<tr>
						<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Project</th>
						<td style="border: 1px solid #ddd; padding: 8px;">${record.project_name || ''}</td>
					</tr>
					<tr>
						<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Location</th>
						<td style="border: 1px solid #ddd; padding: 8px;">${record.location || ''}</td>
					</tr>
					<tr>
						<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Address</th>
						<td style="border: 1px solid #ddd; padding: 8px;">${record.site_address || ''}</td>
					</tr>
					<tr>
						<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Service</th>
						<td style="border: 1px solid #ddd; padding: 8px;">${record.service_name || ''}</td>
					</tr>
					<tr>
						<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Service Type</th>
						<td style="border: 1px solid #ddd; padding: 8px;">${record.service_type === 1 ? 'Slip Request' : record.service_type === 2 ? 'Contract Request' : record.service_type || ''}</td>
					</tr>
					<tr>
						<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Customer Data</th>
						<td style="border: 1px solid #ddd; padding: 8px;">${record.customer_data || ''}</td>
					</tr>
				</table>
				<div style="margin-top: 40px; display: flex; justify-content: space-between;">
					<div style="text-align: center; width: 45%;">
						<strong>Customer Representative</strong><br/><br/><br/><br/>
						<span>(Sign and full name)</span>
					</div>
					<div style="text-align: center; width: 45%;">
						<strong>LIMS Lab Representative</strong><br/><br/><br/><br/>
						<span>(Sign and full name)</span>
					</div>
				</div>
			</div>
		`;

		const printWindow = window.open('', '', 'height=600,width=800');
		if (printWindow) {
			printWindow.document.write('<html><head><title>Print Slip</title>');
			printWindow.document.write('</head><body >');
			printWindow.document.write(printContent);
			printWindow.document.write('</body></html>');
			printWindow.document.close();
			printWindow.focus();
			// Slight delay to ensure content is loaded before printing
			setTimeout(() => {
				printWindow.print();
				printWindow.close();
			}, 250);
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
					onClick={() => handlePrint(record)}
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
				title={editingSlip ? "Edit Slip" : "Create Slip"}
				open={isModalOpen}
				onOk={form.submit}
				onCancel={() => setIsModalOpen(false)}
				destroyOnHidden
				width={800}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSave}
				>
					<div className="grid grid-cols-2 gap-4">
						<Form.Item name="request_code" label="Request Code">
							<Input />
						</Form.Item>
						<Form.Item name="request_date" label="Request Date">
							<DatePicker className="w-full" format="YYYY-MM-DD" />
						</Form.Item>
						<Form.Item name="request_customer" label="Customer">
							<Input />
						</Form.Item>
						<Form.Item name="project_name" label="Project">
							<Input />
						</Form.Item>
						<Form.Item name="location" label="Location">
							<Input />
						</Form.Item>
						<Form.Item name="site_address" label="Address">
							<Input />
						</Form.Item>
						<Form.Item name="service_name" label="Service">
							<Input />
						</Form.Item>
						<Form.Item name="service_type" label="Service Type">
							<Select placeholder="Select service type">
								<Select.Option value={1}>Slip Request</Select.Option>
								<Select.Option value={2}>Contract Request</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item name="customer_data" label="Data" className="col-span-2">
							<Input.TextArea rows={4} />
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default RequestSlips;
