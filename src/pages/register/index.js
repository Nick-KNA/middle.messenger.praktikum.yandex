import Form from '../../modules/form/form';

class RegisterForm extends Form {
	MESSAGE_TIMEOUT = 5000;
	constructor() {
		super('registerForm', [
			'email',
			'login',
			'first_name',
			'second_name',
			'phone',
			'password',
			'password_repeat'
		]);
	}
	metadata = {
		requiredFields: [
			{ name: 'email', text: 'Почта'},
			{ name: 'login', text: 'Логин'},
			{ name: 'first_name', text: 'Имя'},
			{ name: 'second_name', text: 'Фамилия'},
			{ name: 'phone', text: 'Телефон'},
			{ name: 'password', text: 'Пароль'},
			{ name: 'password_repeat', text: 'Пароль (еще раз)'},
		]
	}
	checkFieldValues() {
		let isValid = true;
		if (this.state.password.length > 0 && this.state.password.length < 8) {
			this.showInputError('password', 'Минимальная длина пароля 8 символов');
		}
		if (this.state.password.length > 0 && this.state.password.length < 8) {
			this.showInputError('password_repeat', 'Минимальная длина пароля 8 символов');
		}
		if (this.state.password !== this.state.password_repeat) {
			this.showInputError('password_repeat', 'Пароли не совпадают');
			isValid = false;
		}
		return isValid;
	}
	onSubmitForm(event) {
		event.preventDefault();
		if (this.isValidForm()) {
			this.fetchSubmitForm();
		}
	}
	fetchSubmitForm() {
		const message = this.form.querySelector('span[data-ref="actionMessage"]');
		const submitBtn = this.form.querySelector('button[type="submit"]');
		if (!message || !submitBtn) {
			return;
		}
		submitBtn.classList.add('register-form__actions__submit_hidden');
		message.classList.add('register-form__actions__message_visible');
	}
}

const registerForm = new RegisterForm();
