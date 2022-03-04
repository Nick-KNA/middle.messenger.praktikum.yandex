import { constructChat } from "../../components/chat/chat"
import { constructChatList } from "../../components/chatList/chatList"
import { constructNewMessage } from "../../components/newMessage/newMessage"
import Block, { TCallback, TProps } from "../../components/block/block"
import { Router } from "../../utils/router"
import { compile } from "pug";

const router = new Router();

const image = new URL('../../../static/images/arrowNext.svg', import.meta.url);

const pugString = `
.chat-list
    .chat-list__to-profile
        a.link.chat-list__to-profile__link(href='/profile') Профиль
            img.chat-list__to-profile__link__next(src='${image}')
    .chat-list__search
        input.chat-list__search__input(placeholder='Поиск')
    .chat-list__chats
        != chatLists
.chat-area
    .chat-area__messages
        != chat
    .chat-area__new-message
        != newMessage
`;

const templateRender = compile(pugString);

class Chats extends Block {
    constructor(props: TProps) {
        super('div', props);
        this._templateRender = templateRender;
        this._isFlex = true;
        this.eventBus.emit(Block.EVENTS.INIT);
    }
    _addAttributes() {
        this.element.classList.add('chat-wrapper');
    }
    _registerListeners():void {
        this._listeners = [
            {
                selector: 'a.chat-list__to-profile__link',
                event: 'click',
                callback: this.onProfileClick.bind(this) as TCallback
            },
        ];
    }
    onProfileClick(event: Event): void {
        event.preventDefault();
        router.go('/profile');
    }
}

const chatsPage = new Chats({
    children: {
        chatLists: {
            component: constructChatList,
            listeners: [],
            props: {}
        },
        chat: {
            component: constructChat,
            listeners: [],
            props: {}
        },
        newMessage: {
            component: constructNewMessage,
            listeners: [],
            props: {}
        },
    }
});

export default chatsPage;
