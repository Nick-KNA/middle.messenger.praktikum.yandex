import BaseForm from '../baseForm/baseForm';
import { compile as pugCompile } from 'pug';
import Block, { TProps } from '../block/block';
import Validation from '../../utils/validation';

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
		this._registerListeners();
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
		this._initDepedentBlocks();
	}
	_initDepedentBlocks(): void{

	}
	_registerListeners():void {
		this._listeners = [
			{
				selector: '', //empty selector targets this_element itself
				event: 'submit',
				callback: this.onSubmitForm.bind(this)
			},
			{
				selector: 'input[name="login"]',
				event: 'change',
				callback: this.onInputChange.bind(this)
			},
			{
				selector: 'input[name="password"]',
				event: 'change',
				callback: this.onInputChange.bind(this)
			}
		]
	}
	_addAttributes(): void {
		this.element.classList.add('form', 'login-form');
		this.element.setAttribute('data-ref', 'loginForm');
	}
	ERROR_CLASS = 'error_visible';
	validateForm(): string[]{
		let messages: string[] = [];
		console.log('valid');
		messages = messages.concat(Validation.validateRequired(this.state.login, 'Логин'));
		messages = messages.concat(Validation.validateRequired(this.state.password, 'Пароль'));
		return messages;
	}
	onSubmitForm(event: Event): void {
		event.preventDefault();
		const messages = this.validateForm();
		if (messages.length > 0) {
			const message = messages.join('\n');
			this.showError(this.element.querySelector('span[data-ref="loginFormError"]') as HTMLElement, message, false);
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

