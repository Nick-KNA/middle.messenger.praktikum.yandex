import LoginForm from '../../components/LoginForm/loginForm';
import FormInput from '../../components/formInput/formInput';
import { renderToDOM } from '../../utils/domUtils';

const loginForm = new LoginForm({
	title: 'Вход',
	login: new FormInput({
		labelText: 'Логин',
		name: 'login',
		placeholder: 'Введите свой логин',
		error: '',
		type: 'text'
	}),
	password: new FormInput({
		labelText: 'Пароль',
		name: 'password',
		placeholder: 'Введите свой пароль',
		error: '',
		type: 'password'
	})
});

renderToDOM('.root', loginForm);



