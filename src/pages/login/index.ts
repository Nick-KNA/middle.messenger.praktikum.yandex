import LoginForm from '../../components/loginForm/loginForm';
import { constructFormInput } from '../../components/formInput/formInput';
import { renderToDOM } from '../../utils/domUtils';

const loginForm = new LoginForm({
	title: 'Вход',
	children: {
		login: {
			component: constructFormInput,
			listeners: LoginForm.getInputListeners(),
			props: {
				value: '',
				labelText: 'Логин',
				name: 'login',
				placeholder: 'Введите свой логин',
				error: '',
				type: 'text'
			}
		},
		password: {
			component: constructFormInput,
			listeners: LoginForm.getInputListeners(),
			props: {
				value: '',
				labelText: 'Пароль',
				name: 'password',
				placeholder: 'Введите свой пароль',
				error: '',
				type: 'password'
			}
		}
	}
});

renderToDOM('.root', loginForm);



