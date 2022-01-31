import Block, { TProps } from '../block/block';

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

class BaseForm extends Block {
	state: TFormState
	constructor(props: TProps) {
		super('form', props);
		this.state = {} as TFormState;
	}
	ERROR_CLASS = ''; // redefine
	MESSAGE_TIMEOUT = 5000;
	metadata: TFormMetadata = {
		requiredFields: [
			/* add required fields here in presented structure */
			{ name: 'template', text: 'My template'}
		]
	}
	onInputChange(event: TInputChangeEvent): void {
		const name = event.target.name;
		this.state[name] = event.target.value;
		this.clearInputError(event.target.name);
	}
	onSubmitForm(_event: Event): void {
		//implement you submit logic here
	}
	validateForm(): string[]{
		let messages: string[] = [];
		/* add your custom validation logic of the fields value here, must return messages array (no messages == no errors) */
		return messages;
	}
	checkRequiredFields(): boolean {
		return this.metadata.requiredFields.reduce((isValid, item) => {
			const isNotEmpty = Boolean(this.state[item.name]);
			if (! isNotEmpty) {
				this.showInputError(item.name, `Не заполнено поле "${item.text}"`);
			}
			return isValid && isNotEmpty;
		}, true);
	}
	checkFieldValues(): boolean {
		/* add your custom validation logic of the fields value here, must return boolean isValid */
		return true;
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
