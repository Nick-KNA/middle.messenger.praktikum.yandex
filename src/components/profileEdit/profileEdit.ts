import { compile } from 'pug';
import Block, { TCallback, TComponentConstructor, TProps } from "../block/block"
import BaseForm, { TValidationMeta } from '../baseForm/baseForm';
import Validation from '../../utils/validation';
import authService from "../../services/authService"
import userService from "../../services/userService"
import { TResponse } from "../../services/fetchService"

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
	!= display_name
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
			{ field: 'display_name', value: this.getStringValue(this.state.display_name) },
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
		userService.changeUser(this.state).then(
			(response: TResponse<any>) => {
				if (!response.status) {
					this.router.go('/500');
					return;
				}
				this.router.go('/profile');
			},
			() => {
				this.router.go('/500');
			}
		)

	}
	componentWasShown(): void {
		void authService.me().then(
			(data) => {
				if (! data) {
					return;
				}
				console.log(data);
				this.childrenProps.email.value = data.email;
				this.childrenProps.login.value = data.login;
				this.childrenProps.first_name.value = data.first_name;
				this.childrenProps.second_name.value = data.second_name;
				this.childrenProps.display_name.value = data.display_name;
				this.childrenProps.phone.value = data.phone;
				this._childrenPropsToState();
			}
		)
	}
}

export const constructProfileEdit: TComponentConstructor<TProps, ProfileEdit> = (props: TProps): ProfileEdit => new ProfileEdit(props);

export default ProfileEdit;
