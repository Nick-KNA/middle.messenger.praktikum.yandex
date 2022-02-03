import Block, {TCallback, TComponentConstructor } from '../block/block';
import { compile } from 'pug';

export type TInputChangeEvent = {
	target: HTMLInputElement
}

export type TFormInputProps = {
	value: string
	labelText: string
	name: string
	placeholder: string
	error: string
	onChange: (event: TInputChangeEvent) => void
	onFocus: () => void
	onBlur: () => void
	type?: string
}

const pugString = `
label.label.form-input__label= labelText
input.input.form-input__input(name=name placeholder=placeholder type=type value=value)
if error
	span.error.error_visible.form-input__error(data-ref=name)= error
else
	span.error.form-input__error(data-ref=name)
`
const templateRender = compile(pugString);

class FormInput extends Block {
	constructor(props: TFormInputProps) {
		props.type = props.type || 'text';
		super('div', props);
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}

	_registerListeners(): void {
		this._listeners = [
			{ event: 'change', selector: `input[name="${String(this.props.name)}"]`, callback: this.props.onChange as TCallback },
			{ event: 'focus', selector: `input[name="${String(this.props.name)}"]`, callback: this.props.onFocus as TCallback },
			{ event: 'blur', selector: `input[name="${String(this.props.name)}"]`, callback: this.props.onBlur as TCallback },
		];
	}

	_addAttributes(): void {
		this.element.classList.add('field', 'form-input');
	}
}

export const constructFormInput: TComponentConstructor<TFormInputProps, FormInput> = (props: TFormInputProps): FormInput => new FormInput(props);

export default FormInput;
