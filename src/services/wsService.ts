import EventBus from "../utils/eventBus";
import { authState, chatsState, EStoreEvents, IChatsState, IToken } from "../store/index"
import chatsService from "./chatsService";
import { TResponse } from "./fetchService";
import { Router } from "../utils/router";

const router = new Router();

export enum EWSEvents {
    Opened = 'opened',
    Message = 'message',
}

class WSService extends EventBus {
    ws: WebSocket | null;
    onMessageReceive: (event: MessageEvent) => void;

    constructor() {
        super();
        this.ws = null;
        chatsState.on(EStoreEvents.Updated, this.onChangeSelectedChat.bind(this));
        this.onMessageReceive = this._onMessageReceive.bind(this) as (event: MessageEvent) => void; // safe assert
    }
    onChangeSelectedChat(state: IChatsState): void {
        if (state.selected) {
            this.fetchWSToken(state.selected)
                .then((args: [string, string]): void => {
                    this.openWS(...args);
                })
                .catch((error: any): void => {
                    console.log(error);
                    router.go('/500');
                })
        }
    }
    fetchWSToken(id: string): Promise<[string, string]> {
        return chatsService.fetchWSToken(id).then(
            (response: TResponse<IToken>): Promise<[string, string]> => {
                if (!response.status) {
                    router.go('/500');
                    return Promise.reject([]);
                }
                return Promise.resolve([response.data.token, id]);
            }
        );
    }
    openWS(token: string, id: string): void {
        this.closeOldWS();
        const { user } = authState.getState();
        this.ws = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${user.id}/${id}/${token}`);
        this.ws.addEventListener('message', this.onMessageReceive);
        this.ws.addEventListener('open', this.onWSOpened.bind(this));
    }
    onWSOpened(): void {
        this.emit(EWSEvents.Opened);
    }
    closeOldWS(): void {
        if (this.ws) {
            this.ws.removeEventListener('message', this.onMessageReceive);
            this.ws.close(1000, 'successful');
        }
    }
    sendMessage(message: string): void {
        if (!this.ws) {
            return;
        }
        this.ws.send(message);
    }
    _onMessageReceive(event: MessageEvent): void {
        this.emit(EWSEvents.Message, event.data);
    }
}

const wsService = new WSService();

export default wsService;