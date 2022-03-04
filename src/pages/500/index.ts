import Block, { TCallback } from "../../components/block/block"
import { compile } from "pug"
import { Router } from "../../utils/router"

const router = new Router();

const pugString = `
h1.title 500
p.paragraph Что-то пошло не так
p.paragraph Наши инженеры уже занимаются проблемой
a.link.back-to-navigation(href='/chats') Обратно к чатам
`;

const templateRender = compile(pugString);

class ErrorPage extends Block {
    constructor() {
        super('div', {});
        this._templateRender = templateRender;
        this._isFlex = true;
        this.eventBus.emit(Block.EVENTS.INIT);
    }
    _addAttributes() {
        this.element.classList.add('error-wrapper');
    }
    _registerListeners():void {
        this._listeners = [
            {
                selector: 'a.back-to-navigation',
                event: 'click',
                callback: this.onBackToChatsClick.bind(this) as TCallback
            },
        ];
    }
    onBackToChatsClick(event: Event): void {
        event.preventDefault();
        router.go('/chats');
    }
}

const errorPage = new ErrorPage();

export default errorPage;
