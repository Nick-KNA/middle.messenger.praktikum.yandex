import NavigateButton from '../../components/navigateButton/navigateButton';
import { constructProfileField } from '../../components/profileField/profileField';
import ProfilePasswordEdit from '../../components/profilePasswordEdit/profilePasswordEdit';
import { renderToDOM } from '../../utils/domUtils';

const profilePasswordEdit = new ProfilePasswordEdit({
	title: 'Иван',
	children: {
		old_password: {
			component: constructProfileField,
			listeners: ProfilePasswordEdit.getInputListeners(),
			props: {
				value: '',
				labelText: 'Старый пароль',
				name: 'old_password',
				placeholder: 'Введите старый пароль',
				error: '',
				type: 'password',
				disabled: false
			}
		},
		password: {
			component: constructProfileField,
			listeners: ProfilePasswordEdit.getInputListeners(),
			props: {
				value: '',
				labelText: 'Новый пароль',
				name: 'password',
				placeholder: 'Введите новый пароль',
				error: '',
				type: 'password',
				disabled: false
			}
		},
		password_repeat: {
			component: constructProfileField,
			listeners: ProfilePasswordEdit.getInputListeners(),
			props: {
				value: '',
				labelText: 'Повторите новый пароль',
				name: 'password_repeat',
				placeholder: 'Повторите новый пароль',
				error: '',
				type: 'password',
				disabled: false
			}
		}
	}
});

const navigateBack = new NavigateButton({
	targetPath: 'profile'
});

renderToDOM('.root', profilePasswordEdit);
renderToDOM('.sidebar', navigateBack);
