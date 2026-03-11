import { useState } from 'react';
import { Form, Input, Modal, Tabs, message } from 'antd';
import dayjs from 'dayjs';
import { apiGenerateRequestCode } from '@/api/request.api';
import SlipRequestTab from './service-type-tabs/slip-request-tab';
import ContractRequestTab from './service-type-tabs/contract-request-tab';

const RequestSlipModal = ({ open, editingSlip, onCancel, onSubmit }) => {
	const [form] = Form.useForm();
	const [activeServiceType, setActiveServiceType] = useState('1');
	const [taskDataSource, setTaskDataSource] = useState([]);

	const serviceTypeTabs = [
		{
			key: '1',
			label: 'Slip Request',
			content: (
				<SlipRequestTab
					taskDataSource={taskDataSource}
					setTaskDataSource={setTaskDataSource}
				/>
			)
		},
		{
			key: '2',
			label: 'Contract Request',
			content: (
				<ContractRequestTab
					taskDataSource={taskDataSource}
					setTaskDataSource={setTaskDataSource}
				/>
			)
		}
	];

	const initializeModal = async () => {
		if (editingSlip) {
			let taskData = [];
			if (editingSlip.task_data) {
				try {
					taskData = JSON.parse(editingSlip.task_data);
				} catch {
					taskData = [];
				}
			}

			let requestDataFormValue = editingSlip.request_data;
			if (editingSlip.request_data) {
				try {
					const parsed = JSON.parse(editingSlip.request_data);
					requestDataFormValue = typeof parsed === 'string'
						? parsed
						: JSON.stringify(parsed, null, 2);
				} catch {
					requestDataFormValue = editingSlip.request_data;
				}
			}

			setTaskDataSource(taskData);
			setActiveServiceType(String(editingSlip.service_type || 1));
			form.setFieldsValue({
				...editingSlip,
				request_data: requestDataFormValue,
				request_date: editingSlip.request_date ? dayjs(editingSlip.request_date) : null,
				service_type: editingSlip.service_type || 1
			});
			return;
		}

		form.resetFields();
		setTaskDataSource([]);
		setActiveServiceType('1');
		form.setFieldsValue({ service_type: 1 });

		try {
			const res = await apiGenerateRequestCode(1);
			form.setFieldsValue({
				request_code: res.data.code,
				service_type: 1
			});
		} catch (error) {
			console.error('Failed to generate code:', error);
			message.error('Failed to generate request code');
		}
	};

	const handleServiceTypeChange = async (key) => {
		const nextServiceType = Number(key);
		setActiveServiceType(key);
		form.setFieldsValue({ service_type: nextServiceType });

		if (editingSlip) {
			const currentCode = form.getFieldValue('request_code');
			if (currentCode) {
				form.setFieldsValue({
					request_code: `${nextServiceType}${String(currentCode).slice(1)}`
				});
			}
			return;
		}

		try {
			const res = await apiGenerateRequestCode(nextServiceType);
			form.setFieldsValue({ request_code: res.data.code });
		} catch (error) {
			console.error('Failed to generate code:', error);
			message.error('Failed to generate request code');
		}
	};

	const handleFinish = async (values) => {
		await onSubmit(values, taskDataSource);
	};

	const activeTabContent =
		serviceTypeTabs.find((item) => item.key === activeServiceType)?.content ?? serviceTypeTabs[0].content;

	return (
		<Modal
			title={<span className="text-sm">{editingSlip ? 'Edit Slip' : 'Create Slip'}</span>}
			open={open}
			onOk={form.submit}
			onCancel={onCancel}
			destroyOnHidden
			afterOpenChange={(nextOpen) => {
				if (nextOpen) {
					initializeModal();
				}
			}}
			width={800}
			okButtonProps={{ size: 'small' }}
			cancelButtonProps={{ size: 'small' }}
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleFinish}
				size="small"
				className="text-sm"
			>
				<Form.Item name="service_type" hidden>
					<Input />
				</Form.Item>
				<Tabs
					activeKey={activeServiceType}
					items={serviceTypeTabs.map(({ key, label }) => ({ key, label }))}
					onChange={handleServiceTypeChange}
					className="mb-4"
				/>
				{activeTabContent}
			</Form>
		</Modal>
	);
};

export default RequestSlipModal;
