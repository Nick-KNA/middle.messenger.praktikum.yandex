import { constructNavigateButton } from "../../components/navigateButton/navigateButton";
import { constructProfileField } from '../../components/profileField/profileField';
import ProfilePasswordEdit, { constructProfilePasswordEdit } from "../../components/profilePasswordEdit/profilePasswordEdit";
import { ProfilePage } from "../profile/index";

const profilePasswordEdit = new ProfilePage({
	children: {
		navigateBack: {
			component: constructNavigateButton,
			listeners: [],
			props: {
				targetPath: '/profile'
			}
		},
		profile: {
			component: constructProfilePasswordEdit,
			listeners: [],
			props: {
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
			}
		}
	}
});

export default profilePasswordEdit;
