import BaseForm from '../baseForm/baseForm';
import { compile as pugCompile } from 'pug';
import Block, { TProps } from '../block/block';

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

const templateRender = pugCompile(pugString);

class LoginForm extends BaseForm {
	constructor(props: TProps) {
		super(props);
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}
	_registerListeners():void {
		this._listeners = [
			{
				selector: '', //empty selector targets this_element itself
				event: 'submit',
				callback: this.onSubmitForm.bind(this)
			}
		];
	}
	_addAttributes(): void {
		this.element.classList.add('form', 'login-form');
		this.element.setAttribute('data-ref', 'loginForm');
	}
	ERROR_CLASS = 'error_visible';
	validateForm(): string[]{
		let messages: string[] = [];
		console.log('valid');
		messages = messages.concat(this.validateRequiredField('login', 'Логин', this.state.login));
		messages = messages.concat(this.validateRequiredField('password', 'Пароль', this.state.password));
		return messages;
	}
	onSubmitForm(event: Event): void {
		event.preventDefault();
		console.log(this.state);
		console.log('proceed submit');
		const messages = this.validateForm();
		if (messages.length > 0) {
			return;
		}
		this.fetchSubmitForm();
	}
	fetchSubmitForm(){
		if (this.state.login !== 'ivanivanov') {
			this.showError(this.element.querySelector('span[data-ref="loginFormError"]') as HTMLElement, 'Неверное сочетание логин / пароль', false);
			return;
		}
		window.location.pathname = 'chats';
	}
}

export default LoginForm;

