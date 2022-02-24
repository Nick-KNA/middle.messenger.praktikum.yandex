import Block, {TCallback, TComponentConstructor } from '../block/block';
import { compile } from 'pug';
import { TFormInputProps } from "../formInput/formInput";


export type TProfileFieldProps = TFormInputProps & {
	isValid: boolean
	disabled: boolean
}

const pugString = `
label.profile-field__label(data-ref= name data-error= !error ? 'false' : 'true' )= labelText
input.input.profile-field__input(disabled=disabled placeholder=placeholder value=value name=name type=type)
if error
	span.profile-field__error= error
`;

const templateRender = compile(pugString);

class ProfileField extends Block {
	constructor(props: TProfileFieldProps) {
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
		this.element.classList.add('profile-field');
	}
}

export const constructProfileField: TComponentConstructor<TProfileFieldProps, ProfileField> = (props: TProfileFieldProps) => new ProfileField(props);

export default ProfileField;
