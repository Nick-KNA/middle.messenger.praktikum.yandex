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
				targetPath: '/chats'
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
							value: '',
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
							value: '',
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
							value: '',
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
							value: '',
							labelText: 'Фамилия',
							name: 'second_name',
							placeholder: 'Укажите фамилию',
							error: '',
							type: 'text',
							disabled: true
						}
					},
					display_name: {
						component: constructProfileField,
						listeners: Profile.getInputListeners(),
						props: {
							value: '',
							labelText: 'Имя в чате',
							name: 'display_name',
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
							value: '',
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
