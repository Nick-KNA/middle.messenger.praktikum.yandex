import EventBus from "../utils/eventBus"
import { set } from "../utils/common"

export interface IStoreState {
    [key: string]: any
}

export interface IUser extends IStoreState {
    first_name: string
    second_name: string
    avatar: string
    email: string
    login: string
    phone: string
}

export interface IUserState extends IUser {
    id: number
    display_name: string
}

export interface IUserWithRoleState extends IUserState {
    role: string
}

export interface IAuthState extends IStoreState {
    isLoggedIn: boolean
    user: IUserState
}

export interface IMessage {
    time: string
    content: string
    user_id: number
    type: string
}

export interface IChat {
    id: number
    title: string
    avatar: string
    unread_count: number
    last_message: IMessage
}

export interface IChatsState {
    selected: string | null
    list: IChat[]
}

export interface IChatState {
    users: {
        [key: string]: IUserWithRoleState
    }
    isAdmin: boolean
    messages: IMessage[]
}

export interface IToken {
    token: string
}

export enum EStoreEvents {
    Updated = 'updated',
}

class Store<T extends IStoreState> extends EventBus {
    private state: T;
    private initialState: IStoreState;

    constructor(initialState: T = {} as T) {
        super();
        this.initialState = initialState
        this.state = { ...initialState };
    }

    public getState(): T {
        return this.state;
    }

    public setState(state: T): void {
        Object.assign(this.state, state);
        this.emit(EStoreEvents.Updated, this.state);
    }

    public set(path: string, value: unknown) {
        set(this.state, path, value);
        this.emit(EStoreEvents.Updated, this.state);
    }

    public reset(): void {
        this.state = { ...this.initialState as T };
    }
}

const AUTH_STATE_INITIAL: IAuthState = {
    isLoggedIn: false,
    user: {
        'id': -1,
        'first_name': '',
        'second_name': '',
        'display_name': '',
        'login': '',
        'avatar': '',
        'email': '',
        'phone': ''
    }
};
export const authState: Store<IAuthState> = new Store(AUTH_STATE_INITIAL);

const CHATS_STATE_INITIAL: IChatsState = {
    selected: null,
    list: [],
}
export const chatsState: Store<IChatsState> = new Store(CHATS_STATE_INITIAL);

const CHAT_STATE_INITIAL: IChatState = {
    isAdmin: false,
    messages: [],
    users: {}
};

export const chatState: Store<IChatState> = new Store(CHAT_STATE_INITIAL);

export default Store;
