import Block, { TCallback, TComponentConstructor, TProps } from "../block/block"
import { compile } from 'pug';
import { parseDateTime } from "../../utils/common"
import {
	authState,
	chatsState,
	chatState,
	EStoreEvents,
	IChatState,
	IMessage,
	IUserWithRoleState
} from "../../store/index"
import wsService, { EWSEvents } from "../../services/wsService";
import chatsService from "../../services/chatsService";
import { TResponse } from "../../services/fetchService";
import { Router } from "../../utils/router"

const router = new Router();

const image = new URL('../../../static/images/chatAvatar.svg', import.meta.url);

const pugString = `
mixin message(text, time)
	.chat-message__message
		span.chat-message__message__text= text
		span.chat-message__message__time= time

if !chatsState.selected
	span Чат не выбран
else
	.chat__header
		div.chat__header__avatar
			img.chat__header__avatar__image(src="${image.toString()}")
		span.chat__header__name= chatName
		button.button.chat__header__add-user(data-ref='showNewUserModal') Добавить пользователя
	.chat__content
		each val in state.messages
			if val.user_id === authState.user.id
				.chat-message.chat-message_your
					+message(val.content, val.time)
			else
				.chat-message
					+message(val.content, val.time)
		.modal-wrapper.modal-wrapper_hidden(data-ref='addUserToChatWrapper')
			.modal(data-ref='addUserToChatModal')
				.modal__header
					span.modal__header__title Добавить пользователя в чат
				.modal__content
					label.label Новый пользователь
					input.input(placeholder='Укажите id нового пользователя' data-ref='newUserId')
				.modal__footer
					button.button.modal__footer__confirm(data-ref='addNewUserBtn') Добавить


						
`;

const templateRender = compile(pugString);

class Chat extends Block {

	constructor(props?: TProps) {
		super('div', {
			...props,
			token: '',
			chatsState: chatsState.getState(),
			chatName: '',
			state: chatState.getState(),
			authState: authState.getState()
		});
		chatState.on(EStoreEvents.Updated, this.updatePropsFromChatStore.bind(this));
		chatsState.on(EStoreEvents.Updated, this.updatePropsFromChatsStore.bind(this));
		authState.on(EStoreEvents.Updated, this.updatePropsFromAuthState.bind(this));
		wsService.on(EWSEvents.Message, this.onNewMessage.bind(this));
		wsService.on(EWSEvents.Opened, this.fetchUsers.bind(this));
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}

	_addAttributes(): void {
		this.element.classList.add('chat');
	}

	_registerListeners():void {
		this._listeners = [
			{
				selector: '[data-ref="addUserToChatWrapper"]',
				event: 'click',
				callback: this.onHideNewUserModal.bind(this) as TCallback
			},
			{
				selector: '[data-ref="showNewUserModal"]',
				event: 'click',
				callback: this.onShowNewUserModal.bind(this) as TCallback
			},
			{
				selector: '[data-ref="addUserToChatModal"]',
				event: 'click',
				callback: (event: Event): void => {
					event.stopPropagation();
				}
			},
			{
				selector: '[data-ref="addNewUserBtn"]',
				event: 'click',
				callback: this.onAddUser.bind(this) as TCallback
			},
		];
	}

	updatePropsFromChatsStore(): void {
		const currentChatsState = chatsState.getState();
		this.props.chatsState = {
			...currentChatsState
		};
		if (currentChatsState.selected) {
			const selectedChat = currentChatsState.list.find((item) => String(item.id) === currentChatsState.selected);
			this.props.chatName = selectedChat?.title || '';
		} else {
			this.props.token = '';
		}
	}
	updatePropsFromChatStore(): void {
		const currentChatState = chatState.getState();
		this.props.state = {
			...currentChatState
		};
	}
	updatePropsFromAuthState(): void {
		const currentState = authState.getState();
		this.props.authState = {
			...currentState
		};
	}
	fetchUsers(): void {
		chatState.reset();
		const currentChatsState = chatsState.getState();
		void chatsService.fetchChatUsers(String(currentChatsState.selected))
			.then((response: TResponse<IUserWithRoleState[]>) => {
				if (!response.status) {
					router.go('/500');
				}
				const currentState = chatState.getState();
				const users = response.data.reduce((acc, item) => {
					acc[item.id] = {
						...item,
					};
					return acc;
				}, {} as IChatState['users']);
				chatState.setState({
					...currentState,
					users
				});
				wsService.ws?.send(JSON.stringify({
					content: 0,
					type: 'get old'
				}));
			});
	}
	onNewMessage(response: string): void {
		let newMessages: IMessage | IMessage[];
		try {
			newMessages = JSON.parse(response) as IMessage | IMessage[];
		} catch (err) {
			router.go('/500');
			return;
		}
		const currentState = chatState.getState();
		if (Array.isArray(newMessages)) {
			newMessages.forEach((message): void => {
				message.time = parseDateTime(message.time);
			})
			currentState.messages = currentState.messages.concat(newMessages);
			currentState.messages.sort();
		} else {
			if (newMessages.type !== 'message') {
				return;
			}
			newMessages.time = parseDateTime(newMessages.time);
			currentState.messages = [newMessages].concat(currentState.messages);
		}

		chatState.setState({
			...currentState
		});
	}
	onShowNewUserModal(): void {
		this.changeNewUserModalVisible(true);
	}
	onHideNewUserModal(): void {
		this.changeNewUserModalVisible(false);
	}
	changeNewUserModalVisible(isVisible: boolean): void {
		const modal = document.querySelector('[data-ref="addUserToChatWrapper"]') as HTMLElement;
		if (!modal) {
			return;
		}
		isVisible ? modal.classList.remove('modal-wrapper_hidden') : modal.classList.add('modal-wrapper_hidden');
	}
	onAddUser(): void {
		const userEl = document.querySelector('[data-ref="newUserId"]') as HTMLInputElement;
		if (!userEl) {
			return;
		}
		const state = chatsState.getState();
		const userId = userEl.value || '';
		void chatsService.addNewUser(userId, state.selected || '').then(
			(response: TResponse<any>): void => {
				if (!response.status) {
					this.onHideNewUserModal();
					router.go('/500');
					return;
				}
				this.onHideNewUserModal();
			},
			(error: any): void => {
				console.log(error);
				router.go('/500');
			}
		)
	}
}

export const constructChat: TComponentConstructor<TProps, Chat> = (): Chat => new Chat();

export default Chat;
