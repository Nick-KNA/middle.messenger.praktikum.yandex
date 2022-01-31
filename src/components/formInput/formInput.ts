import Block from '../block/block';
import { compile as pugCompile } from 'pug';

const pugString = `
label.label.form-input__label= labelText
input.input.form-input__input(name=name placeholder=placeholder type=type)
span.error.form-input__error(data-ref=name)
`
const templateRender = pugCompile(pugString);

export type TFormInputProps = {
	labelText: string
	name: string
	placeholder: string
	error: string
	type?: string
}

class FormInput extends Block {
	constructor(props: TFormInputProps) {
		props.type = props.type || 'text';
		super('div', props);
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}

	_addAttributes() {
		this.element.classList.add('field', 'form-input');
	}
}

export default FormInput;
