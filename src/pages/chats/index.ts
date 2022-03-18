import { constructChat } from "../../components/chat/chat"
import ChatList, { constructChatList } from "../../components/chatList/chatList"
import { constructNewMessage } from "../../components/newMessage/newMessage"
import Block, { TCallback, TProps } from "../../components/block/block"
import { Router } from "../../utils/router"
import { compile } from "pug";
import authService from "../../services/authService";
import { TResponse } from "../../services/fetchService";
import chatsService from "../../services/chatsService"

const router = new Router();

const image = new URL('../../../static/images/arrowNext.svg', import.meta.url);

const pugString = `
.chat-list
    .chat-list__to-profile
        a.link.chat-list__to-profile__link(href='/profile') Профиль
            img.chat-list__to-profile__link__next(src='${String(image)}')
    .chat-list__search
        input.chat-list__search__input(placeholder='Поиск')
    .chat-list__chats
        != chatLists
    .chat-list__new-chat
        button.button.chat-list__new-chat__add(data-ref='showNewChatModal') Добавить чат
.chat-area
    .chat-area__messages
        != chat
    .chat-area__new-message
        != newMessage
.modal-wrapper.modal-wrapper_hidden(data-ref='addNewChatModal')
    .modal(data-ref='newChatModalWindow')
        .modal__header
            span.modal__header__title Создать новый чат
        .modal__content
            label.label Новый чат
            input.input(placeholder='Укажите название чата' data-ref='newChatTitle')
        .modal__footer
            button.button.modal__footer__confirm(data-ref='addNewChatBtn') Добавить
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
            {
                selector: '[data-ref="addNewChatModal"]',
                event: 'click',
                callback: this.onHideNewChatModal.bind(this) as TCallback
            },
            {
                selector: '[data-ref="showNewChatModal"]',
                event: 'click',
                callback: this.onShowNewChatModal.bind(this) as TCallback
            },
            {
                selector: '[data-ref="newChatModalWindow"]',
                event: 'click',
                callback: (event: Event): void => {
                    event.stopPropagation();
                }
            },
            {
                selector: '[data-ref="addNewChatBtn"]',
                event: 'click',
                callback: this.onAddChat.bind(this) as TCallback
            },
        ];
    }
    onProfileClick(event: Event): void {
        event.preventDefault();
        router.go('/profile');
    }
    componentWasShown() {
        void authService.me();
    }
    onShowNewChatModal(): void {
        this.changeNewChatModalVisible(true);
    }
    onHideNewChatModal(): void {
        this.changeNewChatModalVisible(false);
    }
    changeNewChatModalVisible(isVisible: boolean): void {
        const modal = document.querySelector('[data-ref="addNewChatModal"]') as HTMLElement;
        if (!modal) {
            return;
        }
        isVisible ? modal.classList.remove('modal-wrapper_hidden') : modal.classList.add('modal-wrapper_hidden');
    }
    onAddChat(): void {
        const titleEl = document.querySelector('[data-ref="newChatTitle"]') as HTMLInputElement;
        if (!titleEl) {
            return;
        }
        const title = titleEl.value || '';
        chatsService.addNewChat(title).then(
            (response: TResponse<any>): void => {
                if (!response.status) {
                    this.onHideNewChatModal();
                    router.go('/500');
                    return;
                }
                const chatListsChild = this.getChildComponent('chatLists');
                if (!chatListsChild) {
                    console.error('missing chatList component in children prop');
                    return;
                }
                const chatList = chatListsChild.value as ChatList;
                chatList.fetchChatsList();
                this.onHideNewChatModal();
            },
            (error: any): void => {
                console.log(error);
                router.go('/500');
            }
        )
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
