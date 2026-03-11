export const printRequestSlip = (record) => {
	let taskDataHtml = '';
	if (record.task_data) {
		try {
			const tasks = JSON.parse(record.task_data);
			if (tasks.length > 0) {
				taskDataHtml = `
					<h3 style="margin-top: 20px;">Task List</h3>
					<table style="width: 100%; border-collapse: collapse;">
						<thead>
							<tr>
								<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Material Type</th>
								<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Unit</th>
								<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
								<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Return Date</th>
								<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Request Content</th>
							</tr>
						</thead>
						<tbody>
							${tasks.map(t => `
								<tr>
									<td style="border: 1px solid #ddd; padding: 8px;">${t.material_type || ''}</td>
									<td style="border: 1px solid #ddd; padding: 8px;">${t.unit || ''}</td>
									<td style="border: 1px solid #ddd; padding: 8px;">${t.quantity || ''}</td>
									<td style="border: 1px solid #ddd; padding: 8px;">${t.return_date || ''}</td>
									<td style="border: 1px solid #ddd; padding: 8px;">${t.request_content || ''}</td>
								</tr>
							`).join('')}
						</tbody>
					</table>
				`;
			}
		} catch (e) { }
	}
	let printRequestData = record.request_data || '';
	if (printRequestData) {
		try {
			let parsed = JSON.parse(printRequestData);
			if (typeof parsed === 'string') {
				printRequestData = parsed;
			} else {
				printRequestData = JSON.stringify(parsed, null, 2);
			}
		} catch (e) { }
	}

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
					<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Request Data</th>
					<td style="border: 1px solid #ddd; padding: 8px;">${printRequestData}</td>
				</tr>
			</table>
			
			${taskDataHtml}

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
		printWindow.document.head.innerHTML = '<title>Print Slip</title>';
		printWindow.document.body.innerHTML = printContent;
		printWindow.focus();
		// Slight delay to ensure content is loaded before printing
		setTimeout(() => {
			printWindow.print();
			printWindow.close();
		}, 250);
	}
};
