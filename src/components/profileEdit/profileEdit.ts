import { compile } from 'pug';
import Block, {TCallback, TProps } from '../block/block';
import BaseForm, { TValidationMeta } from '../baseForm/baseForm';
import Validation from '../../utils/validation';

const image = new URL('../../../static/images/defaultAvatar.svg', import.meta.url);

const pugString = `
.profile__avatar
	img(src="${image.toString()}")
h1.profile__title= title
.profile__fields(data-ref="profileFields")
	!= email
	!= login
	!= first_name
	!= second_name
	!= nickname
	!= phone
.profile-actions
	button.button.profile-actions__save(data-ref='saveProfile') Сохранить
`;

const templateRender = compile(pugString);

class ProfileEdit extends BaseForm {
	constructor(props: TProps) {
		super(props);
		this.ERROR_JOIN = ' / ';
		this._templateRender = templateRender;
		this._childrenPropsToState();
		this.eventBus.emit(Block.EVENTS.INIT);
	}
	_addAttributes(): void {
		this.element.classList.add('profile');
	}
	_registerListeners(): void {
		this._listeners = [
			{
				selector: '', //empty selector targets this_element itself
				event: 'submit',
				callback: this.onSubmitForm.bind(this) as TCallback
			}
		];
	}
	onSubmitForm(event: Event): void {
		event.preventDefault();
		const messages = this.validateFields();
		if (messages.length > 0) {
			return;
		}
		this.fetchSubmitForm();
	}
	getValidationMetadata(): TValidationMeta[] {
		return [
			{ field: 'email', value: this.getStringValue(this.state.email) },
			{ field: 'login', value: this.getStringValue(this.state.login) },
			{ field: 'first_name', value: this.getStringValue(this.state.first_name) },
			{ field: 'second_name', value: this.getStringValue(this.state.second_name)},
			{ field: 'phone', value: this.getStringValue(this.state.phone) },
		]
	}
	validateFields(): string[] {
		let messages: string[] = [];
		const validationMetadata = this.getValidationMetadata();
		validationMetadata.forEach((item) => {
			messages = messages.concat(this.showErrorField(item.field, Validation.validateField(item.field, item.value)))
		});
		return messages;
	}
	fetchSubmitForm(): void {
		// add fetch save profile logic here
		console.log('----------->Save profile<---------');
		console.log(this.state);
		window.location.pathname = 'profile';
	}
}

export default ProfileEdit;
