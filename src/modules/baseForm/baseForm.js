class BaseForm {
	constructor() {
		this.state = {};
	}
	ERROR_CLASS = ''; // redefine
	MESSAGE_TIMEOUT = 5000;
	metadata = {
		requiredFields: [
			/* add required fields here in presented structure */
			{ name: 'template', text: 'My template'}
		]
	}
	onInputChange(event){
		this.state[event.target.name] = event.target.value;
		this.clearInputError(event.target.name);
	}
	onSubmitForm(event) {
		//implement you submit logic here
	}
	isValidForm(){
		let isValid = this.checkRequiredFields();
		isValid = this.checkFieldValues() && isValid;
		return isValid;
	}
	checkRequiredFields(){
		return this.metadata.requiredFields.reduce((isValid, item) => {
			const isNotEmpty = !! this.state[item.name];
			if (! isNotEmpty) {
				this.showInputError(item.name, `Не заполнено поле "${item.text}"`);
			}
			return isValid && isNotEmpty;
		}, true);
	}
	checkFieldValues(){
		/* add your custom validation logic of the fields value here, must return boolean isValid */
		return true;
	}
	showError(element, message, shouldPersist){
		if (!element){
			return;
		}
		element.innerText = message;
		element.classList.add(this.ERROR_CLASS);
		if(shouldPersist){
			return;
		}
		setTimeout(() => {
			this.clearError(element);
		}, this.MESSAGE_TIMEOUT);
	}
	clearError(element){
		element.innerText = '';
		element.classList.remove(this.ERROR_CLASS);
	}
}

export default BaseForm;
