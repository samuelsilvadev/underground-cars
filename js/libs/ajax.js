(function (window, document) {
	'use strict';


	function AJAX() {


		function _serialize(obj, prefix) {

			var str = [];
			var p;

			for (p in obj) {
				if (obj.hasOwnProperty(p)) {
					var k = prefix ? prefix + "[" + p + "]" : p;
					var v = obj[p];
					str.push((v && typeof v === "object") ?
						serialize(v, k) :
						encodeURIComponent(k) + "=" + encodeURIComponent(v));
				}
			}
			return str.join("&");
		}

		function _initAjax(verb, url) {
			var ajax = new XMLHttpRequest();
			ajax.open(verb, url, true);
			return ajax;
		}

		function _handleAjax(ajax, callback) {
			ajax.addEventListener('readystatechange', function () {
				if (ajax.readyState === 4 && ajax.status === 200) {
					try {
						var data = JSON.parse(ajax.responseText);
						callback(data);
					} catch (err) {
						console.error(err);
						callback({ err: true, msg: err, status: ajax.status });
					}
				}

				if (ajax.readyState === 4 && ajax.status !== 200) {
					callback({ err: true, msg: '', status: ajax.status });
				}
			}, false);
		}

		return {
			get: function get(url, callback) {
				var ajax = _initAjax('GET', url);
				ajax.send();
				_handleAjax(ajax, callback);
			},
			post: function post(url, data, callback) {
				var ajax = _initAjax('POST', url);
				ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				ajax.send(_serialize(data));
				_handleAjax(ajax, callback);
			}
		};
	}

	window.AJAX = AJAX();

})(window, document);
