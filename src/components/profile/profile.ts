import { compile } from 'pug';
import BaseForm from '../baseForm/baseForm';
import Block, { TProps } from '../block/block';

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
	!= nickname
	!= phone
.profile-actions
	a.link.profile-actions__link(href='/profileEdit') Изменить данные
	a.link.profile-actions__link(href='/passwordEdit') Изменить пароль
	a.link_red.profile-actions__link(href='/login') Выйти
`;

const templateRender = compile(pugString);

class Profile extends BaseForm {
	constructor(props: TProps) {
		super(props);
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}
	_addAttributes(): void {
		this.element.classList.add('profile');
	}
}

export default Profile;
