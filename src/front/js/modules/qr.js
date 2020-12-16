(function(){
	const CONFIG = window.exports.CONFIG;
	const { fio, description, mobFull, mobShort } = CONFIG.dataFieldNames.phones;

	const getQRurl = (contact) => {
		const mobTels = Array.isArray(contact[mobFull]) ?
			contact[mobFull].reduce((acc, tel) => acc += `TEL:${tel};` , '') :
			`TEL:${contact[mobFull]};`;

		const shortMobTels = Array.isArray(contact[mobShort]) ?
			contact[mobShort].reduce((acc, tel) => acc += `TEL:${tel};` , '') :
			`TEL:${contact[mobShort]};`;

		const meCard = `MECARD:N:${contact[fio] ? contact[fio] : contact[description]};${mobTels}${shortMobTels}`;

		return `https://chart.googleapis.com/chart?cht=qr&chs=${CONFIG.qrSize}x${CONFIG.qrSize}&chl=${meCard}`;
	};

	window.exports.qr = { getQRurl };
})();