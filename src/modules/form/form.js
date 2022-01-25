import BaseForm from '../baseForm/baseForm';

class Form extends BaseForm {
	constructor(ref, inputs) {
		super();
		this.form = document.querySelector(`form[data-ref="${ref}"]`);
		if(! this.form){
			throw new Error(`Failed to initialize form with data-ref="${ref}", no such form in DOM`);
		}
		this.formError = this.form.querySelector(`span[data-ref="${ref}Error"]`);
		if(! this.formError){
			throw new Error('Failed to initialize form, formError label was not found');
		}
		this.state = {};
		inputs.forEach((name) => {
			this[`${name}Input`] = this.form.querySelector(`input[name="${name}"]`);
			if(!this[`${name}Input`]){
				throw new Error(`Failed to initialize form, input with name "${name}" was not found`);
			}
			this[`${name}Error`] = this.form.querySelector(`span[data-ref="${name}"]`);
			if(!this[`${name}Error`]){
				throw new Error(`Failed to initialize form, input error label with data-ref "${name}" was not found`);
			}
			this.state[name] = '';
			this[`${name}Input`].addEventListener('input', this.onInputChange.bind(this));
		});
		this.form.addEventListener('submit', this.onSubmitForm.bind(this));
	}
	ERROR_CLASS = 'error_visible';
	showInputError(name, message){
		this.showError(this[`${name}Error`], message, true);
	}
	clearInputError(name){
		this.clearError(this[`${name}Error`]);
	}
	showFormError(message){
		this.showError(this.formError, message, false);
	}
	clearFormError(){
		this.clearError(this.formError);
	}
	fetchSubmitForm(){
		//implement your fetch logic here
		//TODO add onComplete / onError methods to class
	}
}

export default Form;
