import RegisterForm from '../../components/registerForm/registerForm';
import { constructFormInput } from '../../components/formInput/formInput';
import { renderToDOM } from '../../utils/domUtils';

const registerForm = new RegisterForm({
	title: 'Регистрация',
	children: {
		email: {
			component: constructFormInput,
			listeners: RegisterForm.getInputListeners(),
			props: {
				value: '',
				labelText: 'Почта',
				name: 'email',
				placeholder: 'Введите свой e-mail',
				error: '',
				type: 'text'
			}
		},
		login: {
			component: constructFormInput,
			listeners: RegisterForm.getInputListeners(),
			props: {
				value: '',
				labelText: 'Логин',
				name: 'login',
				placeholder: 'Введите желаемый логин',
				error: '',
				type: 'text'
			}
		},
		first_name: {
			component: constructFormInput,
			listeners: RegisterForm.getInputListeners(),
			props: {
				value: '',
				labelText: 'Имя',
				name: 'first_name',
				placeholder: 'Укажите свое имя',
				error: '',
				type: 'text'
			}
		},
		second_name: {
			component: constructFormInput,
			listeners: RegisterForm.getInputListeners(),
			props: {
				value: '',
				labelText: 'Фамилия',
				name: 'second_name',
				placeholder: 'Укажите свою фамилию',
				error: '',
				type: 'text'
			}
		},
		phone: {
			component: constructFormInput,
			listeners: RegisterForm.getInputListeners(),
			props: {
				value: '',
				labelText: 'Телефон',
				name: 'phone',
				placeholder: 'Укажите свой телефон, например +79991112233',
				error: '',
				type: 'text'
			}
		},
		password: {
			component: constructFormInput,
			listeners: RegisterForm.getInputListeners(),
			props: {
				value: '',
				labelText: 'Пароль',
				name: 'password',
				placeholder: 'Введите пароль',
				error: '',
				type: 'password'
			}
		},
		password_repeat: {
			component: constructFormInput,
			listeners: RegisterForm.getInputListeners(),
			props: {
				value: '',
				labelText: 'Пароль (ещё раз)',
				name: 'password_repeat',
				placeholder: 'Введите пароль еще раз',
				error: '',
				type: 'password'
			}
		}
	}
});

renderToDOM('.root', registerForm);
