import Form from '../../modules/form/form';

class LoginForm extends Form {
	constructor() {
		super('loginForm', [
			'login',
			'password',
		]);
	}
	metadata = {
		requiredFields: [
			{ name: 'login', text: 'Логин'},
			{ name: 'password', text: 'Пароль'},
		]
	}
	onSubmitForm(event) {
		event.preventDefault();
		if (this.isValidForm()) {
			this.fetchSubmitForm();
		}
	}
	fetchSubmitForm(){
		if (this.state.login !== 'ivanivanov') {
			this.showFormError('Неверное сочетание логин / пароль');
			return;
		}
		window.location.pathname = 'chats';
	}
}

const loginForm = new LoginForm();



