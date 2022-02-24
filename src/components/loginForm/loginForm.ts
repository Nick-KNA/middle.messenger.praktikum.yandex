import BaseForm from '../baseForm/baseForm';
import { compile } from 'pug';
import Block, {TCallback, TProps } from '../block/block';

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
		this.eventBus.emit(Block.EVENTS.INIT);
	}
	_registerListeners():void {
		this._listeners = [
			{
				selector: '', //empty selector targets this_element itself
				event: 'submit',
				callback: this.onSubmitForm.bind(this) as TCallback
			}
		];
	}
	_addAttributes(): void {
		this.element.classList.add('form', 'login-form');
		this.element.setAttribute('data-ref', 'loginForm');
	}
	validateForm(): string[]{
		let messages: string[] = [];
		messages = messages.concat(this.validateRequiredField('login', 'Логин', this.state.login));
		messages = messages.concat(this.validateRequiredField('password', 'Пароль', this.state.password));
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
		// TODO next spring add fetch logic and get rid of the hardcode
		console.log('---------->Submit login<----------');
		console.log(this.state);
		if (this.state.login !== 'ivanivanov') { //<--- only ivanivanov with any password is valid combination
			this.showError(this.element.querySelector('span[data-ref="loginFormError"]') as HTMLElement, 'Неверное сочетание логин / пароль', false);
			return;
		}
		window.location.pathname = 'chats';
	}
}

export default LoginForm;

