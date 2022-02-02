import Block, { TProps } from '../block/block';
import { compile as pugCompile } from 'pug';
import { dateToString } from '../../utils/common';
import { ChatListMock } from '../../utils/mockData';

export type TChatListProps = {
	onChangeSelectedChat: (selectedChat: string) => void
}

const MAX_TEXT_LENGTH = 40;

const image = new URL('../../../static/images/chatAvatar.svg', import.meta.url);

const pugString = `
each val in chats
	li.chat-list__chats__item
		div.chat-list__chats__item__avatar
			img.chat-list__chats__item__avatar__image(src="${image}")
		div.chat-list__chats__item__content
			span= val.name
			span= val.lastMessage
		div.chat-list__chats__item__marks
			span= val.lastMessageTime
			div.chat-list__chats__item__marks__new-messages
				if val.newMessages > 0
					span= val.newMessages
`;

const templateRender = pugCompile(pugString);

class ChatList extends Block {
	constructor(props?: TProps) {
		super('ul', {
			...props,
			selectedChat: '',
			chats: []
		});
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}
	componentDidMount(): void {
		// add fetch request logic next sprint, now using mock data
		this.props.chats = ChatListMock.map((item) => {
			return {
				id: item.id,
				name: item.name,
				lastMessageTime: dateToString(item.lastMessage.time),
				lastMessage: item.lastMessage.text.length > MAX_TEXT_LENGTH ? (item.lastMessage.text.slice(0, MAX_TEXT_LENGTH) + '...') : item.lastMessage.text,
				newMessages: item.newMessages
			};
		});
		this.props.selectedChat = ChatListMock[0].id;
	}
}

export default ChatList;
