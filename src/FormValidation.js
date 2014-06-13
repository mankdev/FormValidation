var FormValidation = (function(utils, document, window, undefined) {
	'use strict';

	var availableValidators = [],
		A_VALIDATABLE = 'data-validatable',
		VALIDATION_NAMESPACE = 'validation';

	function registerValidator(name, fn) {
		availableValidators[name] = fn;
	}

	function validate(field) {
		var isValid = processThroughValidators(field);

		isValid ? markFieldAsValid(field) : markFieldAsInValid(field);

		return isValid;
	}

	function processThroughValidators(field) {
		var validatorName,
			validatorParameter,
			validators = utils.getData(field, VALIDATION_NAMESPACE),
			isValid = true;

		for (validatorName in validators) {
			validatorParameter = validators[validatorName];

			if (validators.hasOwnProperty(validatorName) &&
				!availableValidators[validatorName](field, validatorParameter)) {

				isValid = false;
			}
		}

		return isValid;
	}

	function markFieldAsValid(field) {
		utils.trigger(field, FormValidation.E_FIELD_VALID, {
			bubbles: true
		});
	}

	function markFieldAsInValid(field) {
		utils.trigger(field, FormValidation.E_FIELD_INVALID, {
			bubbles: true
		});
	}

	/**
	 * @constructor
	 */
	function FormValidation(form) {

		function init() {
			initListeners();
		}

		function initListeners() {
			form.addEventListener('submit', checkValidity);
		}

		function checkValidity() {
			var fields = form.querySelectorAll('[' + A_VALIDATABLE + ']'),
				isValid = true;

			utils.forEach(fields, function(field) {
				if (!FormValidation.validate(field)) {
					isValid = false;
				}
			});

			isValid ? markFromAsValid() : markFromAsInvalid();

			return isValid;
		}

		function markFromAsValid() {
			utils.trigger(form, FormValidation.E_FORM_VALID);
		}

		function markFromAsInvalid() {
			utils.trigger(form, FormValidation.E_FORM_INVALID);
		}

		init();

		this.checkValidity = checkValidity;
	}

	FormValidation.registerValidator = registerValidator;
	FormValidation.validate = validate;

	FormValidation.E_FIELD_VALID = 'validation:fieldvalid';
	FormValidation.E_FIELD_INVALID = 'validation:fieldinvalid';
	FormValidation.E_FORM_VALID = 'validation:forminvalid';
	FormValidation.E_FORM_INVALID = 'validation:formvalid';

	return FormValidation;
})(jsUtils, document, window);

