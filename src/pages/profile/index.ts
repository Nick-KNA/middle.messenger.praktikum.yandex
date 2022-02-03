import { constructProfileField } from '../../components/profileField/profileField';
import Profile from '../../components/profile/profile';
import { renderToDOM } from '../../utils/domUtils';
import NavigateButton from '../../components/navigateButton/navigateButton';

const profile = new Profile({
	title: 'Иван',
	children: {
		email: {
			component: constructProfileField,
			listeners: Profile.getInputListeners(),
			props: {
				value: 'sample@yandex.ru',
				labelText: 'Почта',
				name: 'email',
				placeholder: 'Укажите email',
				error: '',
				type: 'text',
				disabled: true
			}
		},
		login: {
			component: constructProfileField,
			listeners: Profile.getInputListeners(),
			props: {
				value: 'ivanivanov',
				labelText: 'Логин',
				name: 'login',
				placeholder: 'Укажите логин',
				error: '',
				type: 'text',
				disabled: true
			}
		},
		first_name: {
			component: constructProfileField,
			listeners: Profile.getInputListeners(),
			props: {
				value: 'Иван',
				labelText: 'Имя',
				name: 'first_name',
				placeholder: 'Укажите имя',
				error: '',
				type: 'text',
				disabled: true
			}
		},
		second_name: {
			component: constructProfileField,
			listeners: Profile.getInputListeners(),
			props: {
				value: 'Иванов',
				labelText: 'Фамилия',
				name: 'second_name',
				placeholder: 'Укажите фамилию',
				error: '',
				type: 'text',
				disabled: true
			}
		},
		nickname: {
			component: constructProfileField,
			listeners: Profile.getInputListeners(),
			props: {
				value: 'Иван',
				labelText: 'Имя в чате',
				name: 'nickname',
				placeholder: 'Укажите никнейм',
				error: '',
				type: 'text',
				disabled: true
			}
		},
		phone: {
			component: constructProfileField,
			listeners: Profile.getInputListeners(),
			props: {
				value: '+79993334422',
				labelText: 'Телефон',
				name: 'phone',
				placeholder: 'Укажите телефон',
				error: '',
				type: 'text',
				disabled: true
			}
		}
	}
});

const navigateBack = new NavigateButton({
	targetPath: 'chats'
});

renderToDOM('.root', profile);
renderToDOM('.sidebar', navigateBack);
