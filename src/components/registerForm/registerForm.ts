import BaseForm, { TValidationMeta } from '../baseForm/baseForm';
import { compile } from 'pug';
import Block, {TCallback, TProps } from '../block/block';
import Validation from '../../utils/validation';
import authService, { TRegisterData } from "../../services/authService";
import { TResponse } from "../../services/fetchService";
import { Router } from "../../utils/router";
import { SERVICE_UNAVAILABLE, UNKNOWN_ERROR } from "../../utils/constants"

const router = new Router();

const pugString = `
h1.register-form__title= title
!= email
!= login
!= first_name
!= second_name
!= phone
!= password
!= password_repeat
.register-form__messages
	span.error.register-form__messages__error(data-ref='registerFormError')
.register-form__actions
	button.button.register-form__actions__submit(type='submit') Создать аккаунт
	span.register-form__actions__message(data-ref='actionMessage') Пользователь создан
	a.link.register-form__actions__login(href='/login') Войти
`;

const templateRender = compile(pugString);

class RegisterForm extends BaseForm {
	constructor(props: TProps) {
		super(props);
		this._templateRender = templateRender;
		this._isFlex = true;
		this.eventBus.emit(Block.EVENTS.INIT);
	}
	_registerListeners():void {
		this._listeners = [
			{
				selector: '', //empty selector targets this_element itself
				event: 'submit',
				callback: this.onSubmitForm.bind(this) as TCallback
			},
			{
				selector: 'a.register-form__actions__login',
				event: 'click',
				callback: this.onLogin.bind(this) as TCallback
			},
		];
	}
	_addAttributes(): void {
		this.element.classList.add('form', 'register-form');
		this.element.setAttribute('data-ref', 'registerForm');
	}
	ERROR_CLASS = 'error_visible';
	getValidationMetadata(): TValidationMeta[] {
		return [
			{ field: 'email', value: this.getStringValue(this.state.email) },
			{ field: 'login', value: this.getStringValue(this.state.login) },
			{ field: 'first_name', value: this.getStringValue(this.state.first_name) },
			{ field: 'second_name', value: this.getStringValue(this.state.second_name) },
			{ field: 'phone', value: this.getStringValue(this.state.phone) },
			{ field: 'password', value: this.getStringValue(this.state.password) },
		]
	}
	validateForm(): string[]{
		let messages: string[] = [];
		const validationMetadata = this.getValidationMetadata();
		validationMetadata.forEach((item) => {
			messages = messages.concat(this.showErrorField(item.field, Validation.validateField(item.field, item.value)))
		});
		messages = messages.concat(this.showErrorField('password_repeat', Validation.validateField('password_repeat', this.state.password_repeat, this.state.password)));
		return messages;
	}
	onSubmitForm(event: Event): void {
		event.preventDefault();
		const messages = this.validateForm();
		if (messages.length > 0) {
			return;
		}
		this.fetchSubmitForm();
	}
	fetchSubmitForm(): void {
		console.log('--------->Submit register<--------');
		console.log(this.state);
		authService.register(this.getStateData()).then(
			(response: TResponse<Record<string, any>>): void => {
				if (!response.status) {
					this.showFormMessage(response.data.reason || UNKNOWN_ERROR);
					return;
				}
				router.go('/login');
			},
			(error: any): void => {
				console.log(error);
				this.showFormMessage(SERVICE_UNAVAILABLE);
			}
		);
	}
	getStateData(): TRegisterData {
		return {
			login: String(this.state.login),
			first_name: String(this.state.first_name),
			second_name: String(this.state.second_name),
			email: String(this.state.email),
			phone: String(this.state.phone),
			password: String(this.state.password)
		};
	}
	onLogin(event: Event): void {
		event.preventDefault();
		this.router.go('/login');
	}
	showFormMessage(message: string): void {
		this.showError(document.querySelector('[data-ref="registerFormError"]'), message, false);
	}
}

export default RegisterForm;

