import BaseForm from '../baseForm/baseForm';
import { compile } from 'pug';
import Block, {TCallback, TProps } from '../block/block';
import authService from "../../services/authService"
import { Router } from "../../utils/router"
import { TResponse } from "../../services/fetchService"
import { TInputChangeEvent } from "../formInput/formInput"
import { SERVICE_UNAVAILABLE, UNKNOWN_ERROR } from "../../utils/constants"

const router = new Router();

const pugString = `
h1.login-form__title= title
!= login
!= password
.login-form__messages
	span.error.login-form__messages__error(data-ref='loginFormError')
.login-form__actions
	button.button.login-form__actions__submit(type='submit') Войти
	a.link.login-form__actions__register(href='/register') Ещё не зарегистрированы?
`;

const templateRender = compile(pugString);

class LoginForm extends BaseForm {
	constructor(props: TProps) {
		super(props);
		this.ERROR_CLASS = 'error_visible';
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
				selector: 'a.login-form__actions__register',
				event: 'click',
				callback: this.onRegister.bind(this) as TCallback
			},
		];
	}
	_addAttributes(): void {
		this.element.classList.add('form', 'login-form');
		this.element.setAttribute('data-ref', 'loginForm');
	}
	onInputChange(event: TInputChangeEvent): void {
		const {
			name,
			value
		} = event.target;
		this.state[name] = value;
		this.childrenProps[name].value = value;
		this.childrenProps[name].error = '';
	}
	onInputBlur(): void {
		// redefine since no additional validation required
	}
	validateForm(): string[]{
		let messages: string[] = [];
		messages = messages.concat(this.validateRequiredField('login', 'Логин', this.state.login));
		messages = messages.concat(this.validateRequiredField('password', 'Пароль', this.state.password));
		return messages;
	}
	onRegister(event: Event): void {
		event.preventDefault();
		this.router.go('/register');
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
		// TODO next spring add fetch logic and get rid of the hardcode
		console.log('---------->Submit login<----------');
		console.log(this.state);
		authService.login(this.state.login, this.state.password).then(
			(response: TResponse<Record<string, any>>): void => {
				if (!response.status) {
					this.showFormMessage(response.data.reason || UNKNOWN_ERROR);
					return;
				}
				router.go('/chats');
			},
			(error: any): void => {
				console.log(error);
				this.showFormMessage(SERVICE_UNAVAILABLE);
			}
		)
	}
	showFormMessage(message: string): void {
		this.showError(document.querySelector('[data-ref="loginFormError"]'), message, false);
	}
}

export default LoginForm;

