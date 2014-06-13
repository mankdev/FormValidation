var formsTpl = window.__html__['test/html/simple-form.html'];


function FormHelper(tpl, id) {
	var body = document.body,
		form,
		submit;

	body.innerHTML = tpl;
	form = document.getElementById(id);
	submit = body.querySelector('button[type=submit]');

	return {
		form: form,
		submitWithoutPost: function() {
			form.addEventListener('submit', function(e) {
				e.preventDefault();
			});

			submit.click();
		},
		onSubmit: function(fn) {
			form.addEventListener('submit', function(e) {
				e.preventSubmit();
				fn();
			})
		}
	}
}

(function registerTestValidators(){
	FormValidation.registerValidator('true-validator', function() {
		return true;
	});

	FormValidation.registerValidator('another-true-validator', function() {
		return true;
	});

	FormValidation.registerValidator('false-validator', function() {
		return false;
	});
})();

describe('Validation', function() {
	afterEach(function() {
		document.body.innerHTML = '';
	});

	describe('#checkValidity', function() {
		it('should return false if one of validatable form fields has invalid value', function() {
			var helper = new FormHelper(formsTpl, 'invalidForm'),
				validation = new FormValidation(helper.form);

			expect(validation.checkValidity()).toBe(false);

		});

		it('should return true if all validatable form fields has valid value', function() {
			var helper = new FormHelper(formsTpl, 'validForm'),
				validation = new FormValidation(helper.form);

			expect(validation.checkValidity()).toBe(true);
		});

		it('should return true if form has not validatable fields', function() {
			var helper = new FormHelper(formsTpl, 'novalidatableForm'),
				validation = new FormValidation(helper.form);

			expect(validation.checkValidity()).toBe(true);
		});

		it('should fire E_FORM_VALID if form valid', function(done) {
			var spy = jasmine.createSpy('valid event handler'),
				helper = new FormHelper(formsTpl, 'validForm'),
				validation = new FormValidation(helper.form);


			spy.and.callFake(function() {
				expect(spy).toHaveBeenCalled();
				done();
			});

			helper.form.addEventListener(FormValidation.E_FORM_VALID, spy);

			validation.checkValidity();
		});

		it('should fire E_FORM_INVALID if form invalid', function(done) {
			var spy = jasmine.createSpy('invalid event handler'),
				helper = new FormHelper(formsTpl, 'invalidForm'),
				validation = new FormValidation(helper.form);


			spy.and.callFake(function() {
				expect(spy).toHaveBeenCalled();
				done();
			});

			helper.form.addEventListener(FormValidation.E_FORM_INVALID, spy);

			validation.checkValidity();
		});
	});


	describe('Static', function() {
		describe('#validate', function() {
			it('should throw error if one of validators not registered', function() {
				var input = document.createElement('input');

				input.setAttribute('data-validation-true-validator', true);
				input.setAttribute('data-validation-no-registered-validator', true);

				expect(function(){FormValidation.validate(input)}).toThrowError();
			});

			it('should not throw error if one all validators registered', function() {
				var input = document.createElement('input');

				input.setAttribute('data-validation-true-validator', true);
				input.setAttribute('data-validation-another-true-validator', true);

				expect(function(){FormValidation.validate(input)}).not.toThrowError();
			});

			it('should return true if all necessary validators also return true', function() {
				var input = document.createElement('input');

				input.setAttribute('data-validation-true-validator', true);
				input.setAttribute('data-validation-another-true-validator', true);

				expect(FormValidation.validate(input)).toBe(true);
			});

			it('should return false if one of necessary validators returns false', function() {
				var input = document.createElement('input');

				input.setAttribute('data-validation-true-validator', true);
				input.setAttribute('data-validation-false-validator', true);

				expect(FormValidation.validate(input)).toBe(false);
			});

			it('should fire E_FIELD_VALID if field value passed all validators', function(done) {
				var input = document.createElement('input'),
					spy = jasmine.createSpy('valid event handler');

				input.setAttribute('data-validation-true-validator', true);
				input.setAttribute('data-validation-another-true-validator', true);

				spy.and.callFake(function() {
					expect(spy).toHaveBeenCalled();
					done();
				});

				input.addEventListener(FormValidation.E_FIELD_VALID, spy);
				FormValidation.validate(input);
			});

			it('should fire E_FIELD_VALID which should bubbles up', function(done) {
				var input = document.createElement('input'),
					form = document.createElement('form'),
					spy = jasmine.createSpy('valid event handler');

				input.setAttribute('data-validation-true-validator', true);
				input.setAttribute('data-validation-another-true-validator', true);

				form.appendChild(input);
				document.body.appendChild(form);

				spy.and.callFake(function() {
					expect(spy).toHaveBeenCalled();
					done();
				});

				form.addEventListener(FormValidation.E_FIELD_VALID, spy);
				FormValidation.validate(input);
			});

			it('should fire E_FIELD_INVALID if field value not passed one of validators', function(done) {
				var input = document.createElement('input'),
					spy = jasmine.createSpy('invalid event handler');

				input.setAttribute('data-validation-true-validator', true);
				input.setAttribute('data-validation-false-validator', true);

				spy.and.callFake(function() {
					expect(spy).toHaveBeenCalled();
					done();
				});

				input.addEventListener(FormValidation.E_FIELD_INVALID, spy);
				FormValidation.validate(input);
			});

			it('should fire E_FIELD_INVALID which should bubbles up', function(done) {
				var input = document.createElement('input'),
					form = document.createElement('form'),
					spy = jasmine.createSpy('invalid event handler');

				input.setAttribute('data-validation-true-validator', true);
				input.setAttribute('data-validation-false-validator', true);

				form.appendChild(input);
				document.body.appendChild(form);

				spy.and.callFake(function() {
					expect(spy).toHaveBeenCalled();
					done();
				});

				form.addEventListener(FormValidation.E_FIELD_INVALID, spy);
				FormValidation.validate(input);
			});
		});
	});
});