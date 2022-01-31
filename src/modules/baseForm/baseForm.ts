export type TFormState = Record<string, any>;
export type TRequiredFieldMetadata = {
	name: string
	text: string
}
export type TFormMetadata = {
	requiredFields: TRequiredFieldMetadata[]
}
export type TInputChangeEvent = {
	target: HTMLInputElement
}

class BaseForm {
	state: TFormState
	constructor() {
		this.state = {} as TFormState;
	}
	ERROR_CLASS = ''; // redefine
	MESSAGE_TIMEOUT = 5000;
	onInputChange(event: TInputChangeEvent): void {
		const name = event.target.name;
		this.state[name] = event.target.value;
		this.clearInputError(event.target.name);
	}
	onSubmitForm() {
		//implement you submit logic here
	}
	validateForm(): boolean{
		let isValid = true;
		/* add your custom validation logic of the fields value here, must return boolean isValid */
		return isValid;
	}
	showError(element: HTMLElement, message: string, shouldPersist: boolean): void {
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
	clearError(element: HTMLElement): void {
		element.innerText = '';
		element.classList.remove(this.ERROR_CLASS);
	}
	clearInputError(_inputName: string): void{
		//add clear input error logic here
	}
	showInputError(_name: string, _message: string){
		//add show input error logic here
	}
}

export default BaseForm;
