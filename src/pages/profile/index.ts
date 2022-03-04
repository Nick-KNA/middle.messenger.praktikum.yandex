import { constructProfileField } from '../../components/profileField/profileField';
import Profile, { constructProfile } from "../../components/profile/profile"
import { constructNavigateButton } from "../../components/navigateButton/navigateButton";
import Block, { TProps } from "../../components/block/block";
import { compile } from "pug"

const pugString = `
.sidebar
	!= navigateBack
!= profile
`;

const templateRender = compile(pugString);

export class ProfilePage extends Block {
	constructor(props: TProps) {
		super('div', props);
		this._templateRender = templateRender;
		this._isFlex = true;
		this.eventBus.emit(Block.EVENTS.INIT);
	}
	_addAttributes() {
		this.element.classList.add('profile-wrapper');
	}
}

const profilePage = new ProfilePage({
	children: {
		navigateBack: {
			component: constructNavigateButton,
			listeners: [],
			props: {
				targetPath: 'chats'
			}
		},
		profile: {
			component: constructProfile,
			listeners: [],
			props: {
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
			}
		}
	}
})

export default profilePage;
