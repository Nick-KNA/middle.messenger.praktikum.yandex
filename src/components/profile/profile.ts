import { compile } from 'pug';
import BaseForm from '../baseForm/baseForm';
import Block, { TCallback, TComponentConstructor, TProps } from "../block/block"
import { authState } from "../../store/index"
import authService from "../../services/authService"
import { TResponse } from "../../services/fetchService"

const image = new URL('../../../static/images/defaultAvatar.svg', import.meta.url);

const pugString = `
.profile__avatar
	img(src="${image.toString()}")
h1.profile__title= title
.profile__fields(data-ref="profileFields")
	!= email
	!= login
	!= first_name
	!= second_name
	!= display_name
	!= phone
.profile-actions
	a.link.profile-actions__link(href='/profileEdit' data-ref='profileEdit') Изменить данные
	a.link.profile-actions__link(href='/passwordEdit' data-ref='passwordEdit') Изменить пароль
	a.link_red.profile-actions__link(href='/login' data-ref='logout') Выйти
`;

const templateRender = compile(pugString);

class Profile extends BaseForm {
	constructor(props: TProps) {
		super({
			...props,
			authState: authState.getState()
		});
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}
	_addAttributes(): void {
		this.element.classList.add('profile');
	}
	_registerListeners():void {
		this._listeners = [
			{
				selector: 'a[data-ref="profileEdit"]',
				event: 'click',
				callback: this.onNavigateEditProfile.bind(this) as TCallback
			},
			{
				selector: 'a[data-ref="passwordEdit"]',
				event: 'click',
				callback: this.onNavigateEditPassword.bind(this) as TCallback
			},
			{
				selector: 'a[data-ref="logout"]',
				event: 'click',
				callback: this.onLogout.bind(this) as TCallback
			},
		];
	}
	componentWasShown(): void {
		void authService.me().then(
			(data) => {
				if (! data) {
					return;
				}
				this.childrenProps.email.value = data.email;
				this.childrenProps.login.value = data.login;
				this.childrenProps.first_name.value = data.first_name;
				this.childrenProps.second_name.value = data.second_name;
				this.childrenProps.display_name.value = data.display_name;
				this.childrenProps.phone.value = data.phone;
			}
		)
	}
	onNavigateEditProfile(event: Event): void {
		event.preventDefault();
		this.router.go('/profileEdit');
	}
	onNavigateEditPassword(event: Event): void {
		event.preventDefault();
		this.router.go('/passwordEdit');
	}
	onLogout(event: Event): void {
		event.preventDefault();
		void authService.logout().then(
			(response: TResponse<any>) => {
				if (!response.status) {
					this.router.go('/500');
					return;
				}
				this.router.go('/login');
			},
			() => {
				this.router.go('/500');
			}
		);
	}
}

export const constructProfile: TComponentConstructor<TProps, Profile> = (props: TProps): Profile => new Profile(props);

export default Profile;
