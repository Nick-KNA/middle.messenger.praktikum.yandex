import Block, { TProps } from '../block/block';
import Validation from '../../utils/validation';
import { TInputChangeEvent } from '../formInput/formInput';

export type TRequiredFieldMetadata = {
	name: string
	text: string
}
export type TFormMetadata = {
	requiredFields: TRequiredFieldMetadata[]
}

export type TValidationMeta = {
	field: string
	value: string
}

class BaseForm extends Block {
	constructor(props: TProps) {
		super('form', props);
	}
	ERROR_CLASS = ''; // redefine
	ERROR_JOIN = '\n';
	MESSAGE_TIMEOUT = 5000;
	onInputChange(event: TInputChangeEvent): void {
		const {
			name,
			value
		} = event.target;
		this.state[name] = value;
		this.childrenProps[name].value = value;
		this.showErrorField(name, Validation.validateField(name, value));
	}
	getSubmitButton(): HTMLElement {
		return this.element.querySelector('button[type="submit"]') as HTMLElement;
	}
	onInputFocus(): void {
		// add your logic here
	}
	onInputBlur(event: TInputChangeEvent): void {
		const {
			name,
			value
		} = event.target;
		this.showErrorField(name, Validation.validateField(name, value));
	}
	onSubmitForm(event: Event): void {
		//implement you submit logic here
		console.log('BaseForm onSubmitForm event', event);
	}
	validateForm(): string[]{
		const messages: string[] = [];
		/* add your custom validation logic of the fields value here, must return messages array (no messages == no errors) */
		return messages;
	}
	validateRequiredField(field: string, name: string, value: string): string[]{
		const messages = Validation.validateRequired(value, name);
		return this.showErrorField(field, messages);
	}
	showErrorField(field: string, messages: string[]): string[] {
		this.childrenProps[field].error = messages.length > 0 ? messages.join(this.ERROR_JOIN) : null;
		return messages;
	}
	checkFieldValues(): boolean {
		/* add your custom validation logic of the fields value here, must return boolean isValid */
		return true;
	}
	showError(element: HTMLElement | null, message: string, shouldPersist: boolean): void {
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
	getStringValue(value: any): string {
		return !value ? '' : String(value);
	}
}

export default BaseForm;
