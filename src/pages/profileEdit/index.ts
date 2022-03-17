import { constructNavigateButton } from "../../components/navigateButton/navigateButton"
import ProfileEdit, { constructProfileEdit } from "../../components/profileEdit/profileEdit"
import { constructProfileField } from '../../components/profileField/profileField';
import { ProfilePage } from "../profile/index";

const profileEditPage = new ProfilePage({
	children: {
		navigateBack: {
			component: constructNavigateButton,
			listeners: [],
			props: {
				targetPath: '/profile'
			}
		},
		profile: {
			component: constructProfileEdit,
			listeners: [],
			props: {
				title: 'Иван',
				children: {
					email: {
						component: constructProfileField,
						listeners: ProfileEdit.getInputListeners(),
						props: {
							value: '',
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
							value: '',
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
							value: '',
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
							value: '',
							labelText: 'Фамилия',
							name: 'second_name',
							placeholder: 'Укажите фамилию',
							error: '',
							type: 'text',
							disabled: false
						}
					},
					display_name: {
						component: constructProfileField,
						listeners: ProfileEdit.getInputListeners(),
						props: {
							value: '',
							labelText: 'Имя в чате',
							name: 'display_name',
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
							value: '',
							labelText: 'Телефон',
							name: 'phone',
							placeholder: 'Укажите телефон',
							error: '',
							type: 'text',
							disabled: false
						}
					},
				}
			}
		}
	}
});

export default profileEditPage;
