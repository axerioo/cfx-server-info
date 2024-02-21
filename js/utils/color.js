const cfxColorCodes = {
	'^0': '#F0F0F0',
	'^1': '#F44336',
	'^2': '#4CAF50',
	'^3': '#FFEB3B',
	'^4': '#42A5F5',
	'^5': '#03A9F4',
	'^6': '#9C27B0',
	'^7': '#F0F0F0',
	'^8': '#FF5722',
	'^9': '#9E9E9E'
};

export const fixColors = (hostname) => {
	let newHostname = hostname.replace(/\^([0-9])/g, function(match, p1) {
		return '<span style="color: ' + cfxColorCodes['^' + p1] + '">';
	});
	newHostname = newHostname.replace(/\^/g, '</span>');
	return newHostname;
}

export const colorizePing = (ping) => {
	if (ping <= 50) return `<span style="color: #4CAF50">${ping} ms</span>`;
	if (ping <= 100) return `<span style="color: #FFEB3B">${ping} ms</span>`;
	if (ping <= 150) return `<span style="color: #FF9800">${ping} ms</span>`;
	return `<span style="color: #F44336">${ping} ms</span>`;
}