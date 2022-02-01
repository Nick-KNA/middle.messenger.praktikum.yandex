import Block, {TChildListener, TProps } from '../block/block';
import Validation from '../../utils/validation';

export type TFormState = Record<string, any>;
export type TRequiredFieldMetadata = {
	name: string
	text: string
}
export type TFormMetadata = {
	requiredFields: TRequiredFieldMetadata[]
}
export type TInputEvent = {
	target: HTMLInputElement
}

export type TValidationMeta = {
	field: string
	value: string
}

class BaseForm extends Block {
	state: TFormState
	constructor(props: TProps) {
		super('form', props);
		this.state = {} as TFormState;
	}
	ERROR_CLASS = ''; // redefine
	MESSAGE_TIMEOUT = 5000;
	onInputChange(event: TInputEvent): void {
		console.log('input change');
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
	onInputBlur(event: TInputEvent): void {
		const {
			name,
			value
		} = event.target;
		this.showErrorField(name, Validation.validateField(name, value));
	}
	onSubmitForm(_event: Event): void {
		//implement you submit logic here
	}
	validateForm(): string[]{
		let messages: string[] = [];
		/* add your custom validation logic of the fields value here, must return messages array (no messages == no errors) */
		return messages;
	}
	validateRequiredField(field: string, name: string, value: string): string[]{
		const messages = Validation.validateRequired(value, name);
		return this.showErrorField(field, messages);
	}
	showErrorField(field: string, messages: string[]): string[] {
		this.childrenProps[field].error = messages.length > 0 ? messages.join('\n') : null;
		return messages;
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
	
	static getInputListeners(): TChildListener[] {
		return [
			{ prop: 'onChange', callbackRef: 'onInputChange' },
			{ prop: 'onFocus', callbackRef: 'onInputFocus' },
			{ prop: 'onBlur', callbackRef: 'onInputBlur' }
		];
	}
}

export default BaseForm;
