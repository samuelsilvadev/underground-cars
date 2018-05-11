(function (DOM, AJAX) {
	'use strict';

	function appModule() {

		var API_CARS = 'http://localhost:3000/car';
		var $carImage = new DOM('[data-js="car-input-image"]');
		var $carBrand = new DOM('[data-js="car-input-brand"]');
		var $carYear = new DOM('[data-js="car-input-year"]');
		var $carPlate = new DOM('[data-js="car-input-plate"]');
		var $carColor = new DOM('[data-js="car-input-color"]');
		var $btnCarForm = new DOM('[data-js="btn-car-form"]');
		var $tbodyListCars = new DOM('[data-js="car-list-body"]');
		var $companyName = new DOM('[data-js="company-name"]');
		var $companyTelephone = new DOM('[data-js="company-telephone"]');

		var savedCars = [];

		function init() {
			_getCompanyData();
			_getCars();
			$btnCarForm.on('click', handleSubmitCarForm);
		}

		function _getCompanyData() {
			AJAX.get('./company.json', function (data) {
				if (!data.err) {
					$companyName.getFirst().textContent = data.name;
					$companyTelephone.getFirst().textContent = data.phone;
				}
			});
		}

		function _getCars() {
			AJAX.get(API_CARS, function (data) {
				savedCars = [];
				data.forEach(function (car) {
					_updateTableCar(car);
					savedCars.push(car);
				});
			});
		}

		function _sendCarToServer(car) {
			AJAX.post(API_CARS, car, function (data) {
				if (data.response === 'success') {
					console.log('Yes..');
				}
			});
		}

		function _removeCarFromServer(plateCar) {
			AJAX.del(API_CARS, plateCar, function (data) {
				if (data.response === 'success') {
					console.log('Yes..');
				}
			});
		}

		function _saveCar() {

			var newCarObj = {
				image: $carImage.getFirst().value,
				brandModel: $carBrand.getFirst().value,
				year: $carYear.getFirst().value,
				plate: $carPlate.getFirst().value,
				color: $carColor.getFirst().value
			};

			if (_isFormValid(newCarObj) && !_hasThisPlate(newCarObj.plate)) {
				_sendCarToServer(newCarObj);
				savedCars.push(newCarObj);
				_updateTableCar(newCarObj);
				_clearForm();
			}
		}

		function _removeCar() {

			var plate = this.getAttribute('data-js-plate');
			var __removeFromArray = function __removeFromArray() {
				savedCars = savedCars.filter(function (car) {
					return car.plate !== plate;
				});
			};
			var __removeFromView = function __removeFromView() {
				var $trToRemove = new DOM('[data-js-tr-plate="' + plate + '"]');
				$trToRemove.getFirst().remove();
			};
			if (plate) {
				__removeFromArray();
				__removeFromView();
				_removeCarFromServer('plate=' + plate);
			}
		}

		function _clearForm() {
			$carImage.getFirst().value = '';
			$carBrand.getFirst().value = '';
			$carYear.getFirst().value = '';
			$carPlate.getFirst().value = '';
			$carColor.getFirst().value = '';
		}

		function _isFormValid(objCar) {

			var formIsValid = true;
			for (var prop in objCar) {
				if (objCar.hasOwnProperty(prop)) {
					if (!objCar[prop]) {
						formIsValid = false;
					}
				}
			}
			return formIsValid;
		}

		function _hasThisPlate(plate) {
			return savedCars.some(function (car) {
				return car.plate === plate;
			});
		}

		function _updateTableCar(obj) {

			var $fragment = document.createDocumentFragment();
			var $newTr = document.createElement('tr');
			$newTr.setAttribute('data-js-tr-plate', obj.plate)
			$newTr.appendChild(_createImg(obj.image));
			$newTr.appendChild(_createTd(obj.brandModel));
			$newTr.appendChild(_createTd(obj.year));
			$newTr.appendChild(_createTd(obj.plate));
			$newTr.appendChild(_createTd(obj.color));
			$newTr.appendChild(_createBtnRemove('Remove', obj.plate));

			$fragment.appendChild($newTr)

			$tbodyListCars.getFirst().appendChild($fragment);
		}

		function _createTd(text) {
			var $newTd1 = document.createElement('td');
			$newTd1.textContent = text;
			return $newTd1;
		}

		function _createImg(url) {
			var $td = _createTd('');
			var $newImg = document.createElement('img');
			$newImg.src = url;
			$td.appendChild($newImg)
			return $td;
		}

		function _createBtnRemove(text, plate) {
			var $td = _createTd('');
			var $newBtn = document.createElement('button');
			$newBtn.textContent = text;
			$newBtn.setAttribute('data-js-plate', plate);
			$newBtn.setAttribute('class', 'car-list__btn-remove');
			$newBtn.addEventListener('click', _removeCar);
			$td.appendChild($newBtn);
			return $td;
		}

		function handleSubmitCarForm(e) {
			e.preventDefault();
			_saveCar();
		}

		return {
			init: init
		};
	}

	appModule().init();
})(window.DOM, window.AJAX);
