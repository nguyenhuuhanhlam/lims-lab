import { Form, Input, DatePicker } from 'antd';

const SlipRequestTab = () => {
	return (
		<div className="space-y-4">
			<div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
				<div className="font-medium">Slip Request</div>
				<div className="mt-1 text-sky-800">
					Create a standard request slip for laboratory service intake.
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
		</div>
	);
};

export default SlipRequestTab;
