import Block, { TCallback, TComponentConstructor, TProps } from "../block/block"
import { compile } from 'pug';
import { chatsState, EStoreEvents, IChat, IChatsState } from "../../store/index";
import chatsService from "../../services/chatsService";
import { TResponse } from "../../services/fetchService";
import { Router } from "../../utils/router";
import { parseDate } from "../../utils/common"

const router = new Router();

export type TChatListProps = {
	onChangeSelectedChat: (selectedChat: string) => void
}

const image = new URL('../../../static/images/chatAvatar.svg', import.meta.url);

const pugString = `
if state.list.length === 0
	li.chat-list_empty
		span Список пуст
each val in state.list
	li.chat-list__chats__item(data-selected= val.id === selectedChat ? 'true' : 'false' data-chatId= val.id)
		div.chat-list__chats__item__avatar
			img.chat-list__chats__item__avatar__image(src="${image.toString()}")
		div.chat-list__chats__item__content
			span= val.title
			span= ! val.last_message ? '-' : val.last_message.content
		div.chat-list__chats__item__marks
			span= ! val.last_message ? '-' : val.last_message.time
			div.chat-list__chats__item__marks__new-messages
				if val.unread_count > 0
					span= val.unread_count
`;

const templateRender = compile(pugString);

class ChatList extends Block {
	constructor(props?: TProps) {
		super('ul', {
			...props,
			state: chatsState.getState()
		});
		chatsState.on(EStoreEvents.Updated, this.updatePropsFromStore.bind(this));
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}
	_registerListeners():void {
		this._listeners = [
			{
				selector: '[data-chatid]',
				event: 'click',
				callback: this.onChatSelected.bind(this) as TCallback
			},
		];
	}
	updatePropsFromStore(state: IChatsState): void {
		this.props.state = {
			...state
		};
	}
	componentWasShown() {
		this.fetchChatsList();
	}
	fetchChatsList(): void {
		// there has to be a web socket to update chat list with new messages, no such API found
		chatsService.fetchChatsList().then(
			(response: TResponse<IChat[]>): void => {
				if (!response.status) {
					router.go('/500');
					return;
				}
				const oldState =chatsState.getState();
				response.data.forEach((chat) => {
					if (chat.last_message) {
						chat.last_message.time = parseDate(chat.last_message.time);
					}
				})
				chatsState.setState({
					selected: oldState.selected,
					list: response.data
				});
			},
			(error: any): void => {
				console.log(error);
				router.go('/500');
			}
		)
	}
	onChatSelected(event: Event): void {
		const target = event.currentTarget as HTMLElement;
		const oldState =chatsState.getState();
		chatsState.setState({
			selected: target.dataset.chatid || '',
			list: oldState.list
		});
	}
}

export const constructChatList: TComponentConstructor<TProps, ChatList> = (): ChatList => new ChatList();

export default ChatList;
