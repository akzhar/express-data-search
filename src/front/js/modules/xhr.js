(function() {
	const CONFIG = window.exports.CONFIG;

	const reject = (msg) => {
		alert(msg);
		throw new Error(msg);
	};

	// ф-ция принимает ссылку, тип загружаемоего ресурса и обработчик успешного запроса
	// ф-ция возвращает объект xhr с методом send()
	const getRequest = (url, contentType, resolve) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.setRequestHeader('Content-Type', contentType);
		xhr.timeout = CONFIG.xhrTimeout;
		xhr.addEventListener('error', () => reject(CONFIG.xhrMsg.error));
		xhr.addEventListener('timeout', () => reject(CONFIG.xhrMsg.timeout));
		xhr.addEventListener('load', () => {
			if (xhr.status != CONFIG.xhrStatus.ok) reject(`${CONFIG.xhrMsg.fail}\n${xhr.status}: ${xhr.statusText}`);
			resolve(xhr.responseText);
		});
		return xhr;
	};

	window.exports.xhr = { getRequest };
})();