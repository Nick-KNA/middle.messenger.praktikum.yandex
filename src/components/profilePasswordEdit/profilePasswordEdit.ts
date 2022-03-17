import BaseForm, { TValidationMeta } from '../baseForm/baseForm';
import { compile } from 'pug';
import Block, { TCallback, TComponentConstructor, TProps } from "../block/block"
import Validation from '../../utils/validation';
import { TResponse } from "../../services/fetchService"
import userService from "../../services/userService"

const image = new URL('../../../static/images/defaultAvatar.svg', import.meta.url);

const pugString = `
.profile__avatar
	img(src="${image.toString()}")
h1.profile__title= title
.profile__fields(data-ref="profileFields")
	!= old_password
	!= password
	!= password_repeat
.profile-actions
	button.button.profile-actions__save(data-ref='saveProfile') Сохранить
`;

const templateRender = compile(pugString);

class ProfilePasswordEdit extends BaseForm {
	constructor(props: TProps) {
		super(props);
		this.ERROR_JOIN = ' / ';
		this._templateRender = templateRender;
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
			{ field: 'password', value: this.getStringValue(this.state.password) }
		]
	}
	validateFields(): string[] {
		let messages: string[] = [];
		const validationMetadata = this.getValidationMetadata();
		messages = messages.concat(this.showErrorField('old_password', Validation.validateRequired(this.getStringValue(this.state.password), 'Старый пароль')));
		validationMetadata.forEach((item) => {
			messages = messages.concat(this.showErrorField(item.field, Validation.validateField(item.field, item.value)))
		});
		messages = messages.concat(this.showErrorField('password_repeat', Validation.validateField('password_repeat', this.state.password_repeat, this.state.password)));
		return messages;
	}
	fetchSubmitForm(): void {
		void userService.changePassword({
			oldPassword: String(this.state.old_password),
			newPassword: String(this.state.password)
		}).then(
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
		);

	}
}

export const constructProfilePasswordEdit: TComponentConstructor<TProps, ProfilePasswordEdit> =
	(props: TProps): ProfilePasswordEdit => new ProfilePasswordEdit(props);

export default ProfilePasswordEdit;
