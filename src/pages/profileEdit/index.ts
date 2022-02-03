import NavigateButton from '../../components/navigateButton/navigateButton';
import ProfileEdit from '../../components/profileEdit/profileEdit';
import { constructProfileField } from '../../components/profileField/profileField';
import { renderToDOM } from '../../utils/domUtils';

const profileEdit = new ProfileEdit({
	title: 'Иван',
	children: {
		email: {
			component: constructProfileField,
			listeners: ProfileEdit.getInputListeners(),
			props: {
				value: 'sample@yandex.ru',
				labelText: 'Почта',
				name: 'email',
				placeholder: 'Укажите email',
				error: '',
				type: 'text',
				disabled: false
			}
		},
		login: {
			component: constructProfileField,
			listeners: ProfileEdit.getInputListeners(),
			props: {
				value: 'ivanivanov',
				labelText: 'Логин',
				name: 'login',
				placeholder: 'Укажите логин',
				error: '',
				type: 'text',
				disabled: false
			}
		},
		first_name: {
			component: constructProfileField,
			listeners: ProfileEdit.getInputListeners(),
			props: {
				value: 'Иван',
				labelText: 'Имя',
				name: 'first_name',
				placeholder: 'Укажите имя',
				error: '',
				type: 'text',
				disabled: false
			}
		},
		second_name: {
			component: constructProfileField,
			listeners: ProfileEdit.getInputListeners(),
			props: {
				value: 'Иванов',
				labelText: 'Фамилия',
				name: 'second_name',
				placeholder: 'Укажите фамилию',
				error: '',
				type: 'text',
				disabled: false
			}
		},
		nickname: {
			component: constructProfileField,
			listeners: ProfileEdit.getInputListeners(),
			props: {
				value: 'Иван',
				labelText: 'Имя в чате',
				name: 'nickname',
				placeholder: 'Укажите никнейм',
				error: '',
				type: 'text',
				disabled: false
			}
		},
		phone: {
			component: constructProfileField,
			listeners: ProfileEdit.getInputListeners(),
			props: {
				value: '+79993334422',
				labelText: 'Телефон',
				name: 'phone',
				placeholder: 'Укажите телефон',
				error: '',
				type: 'text',
				disabled: false
			}
		}
	}
});

const navigateBack = new NavigateButton({
	targetPath: 'profile'
});

renderToDOM('.root', profileEdit);
renderToDOM('.sidebar', navigateBack);

