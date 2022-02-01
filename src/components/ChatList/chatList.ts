import Block, { TProps } from '../block/block';
import { compile as pugCompile } from 'pug';
import { dateToString } from '../../utils/common';

export type TChatListItemRaw = {
	id: string
	name: string
	lastMessage: {
		time: Date
		text: string
	}
	newMessages: number
}

export type TChatListItem = {
	id: string
	name: string
	lastMessageTime: string
	lastMessage: string
	newMessages: number
}

export type TChatListState = {
	selectedChat: string
	chats: TChatListItem[]
}

export type TChatListProps = {
	onChangeSelectedChat: (selectedChat: string) => void
}

export const ChatListMock: TChatListItemRaw[] = [
	{
		id: '1001',
		name: 'Александр Миронов',
		newMessages: 0,
		lastMessage: {
			time: new Date(),
			text: 'So what do you think about it? Mind if i try?'
		}
	},
	{
		id: '1002',
		name: 'Сергей Коптев',
		newMessages: 2,
		lastMessage: {
			time: new Date(),
			text: 'Lore ipsum lore ipsum lore ipsum lore ipsum lore ipsum'
		}
	},
	{
		id: '1003',
		name: 'Петр Чугунов',
		newMessages: 0,
		lastMessage: {
			time: new Date(),
			text: 'And then all of the sudden it was pitch dark and the night came'
		}
	},
	{
		id: '1004',
		name: 'Рената Петрова',
		newMessages: 1,
		lastMessage: {
			time: new Date(),
			text: 'Lore ipsum lore ipsum'
		}
	},
	{
		id: '1005',
		name: 'Алексей Салихов',
		newMessages: 0,
		lastMessage: {
			time: new Date(),
			text: 'Lore ipsum lore ipsum'
		}
	},
];

const MAX_TEXT_LENGTH = 40;

const image = new URL('../../../static/images/chatAvatar.svg', import.meta.url);

const pugString = `
each val in chats
	li.chat-list__item
		div.chat-list__item__avatar
			img.chat-list__item__avatar__image(src="${image}")
		div.chat-list__item__content
			span= val.name
			span= val.lastMessage
		div.chat-list__item__marks
			span= val.lastMessageTime
			div.chat-list__item__marks__new-messages
				if val.newMessages > 0
					span= val.newMessages
`;

const templateRender = pugCompile(pugString);

class ChatList extends Block {
	constructor(props: TProps) {
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
