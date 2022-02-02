import Block, { TProps } from '../block/block';
import { compile as pugCompile } from 'pug';
import { ChatListMock } from '../../utils/mockData';
import { dateTimeToString } from '../../utils/common';

const image = new URL('../../../static/images/chatAvatar.svg', import.meta.url);

const pugString = `
mixin message(text, time)
	.chat-message__message
		span.chat-message__message__text= text
		span.chat-message__message__time= time

if !selectedChat
	span Чат не выбран
else
	.chat__header
		div.chat__header__avatar
			img.chat__header__avatar__image(src="${image}")
		span.chat__header__name= chatName
	.chat__content
		for val in messages
			if val.isYourMessage
				.chat-message.chat-message_your
					+message(val.text, val.time)
			else
				.chat-message
					+message(val.text, val.time)
						
`;

const templateRender = pugCompile(pugString);

class Chat extends Block {
	constructor(props?: TProps) {
		super('div', {
			...props,
			selectedChat: '',
			chatName: '',
			messages: []
		});
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}

	_addAttributes() {
		this.element.classList.add('chat');
	}

	componentDidMount(): void {
		// add fetch request logic next sprint, now using mock data
		this.props.messages = ChatListMock[0].messages.map((item) => {
			return {
				isYourMessage: item.isYourMessage,
				text: item.text,
				time: dateTimeToString(item.time),
			}
		});
		this.props.chatName = ChatListMock[0].name;
		this.props.selectedChat = ChatListMock[0].id;
	}
}

export default Chat;
