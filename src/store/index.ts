import EventBus from "../utils/eventBus"
import { set } from "../utils/common"

export interface IStoreState {
    [key: string]: any
}

export interface IUserState extends IStoreState{
    id: number
    first_name: string
    second_name: string
    display_name: string
    login: string
    avatar: string
    email: string
    phone: string
}

export interface IAuthState extends IStoreState {
    isLoggedIn: boolean
    user: IUserState
}

export interface IChatsState {
    selected: string
    list: string[]
}

export enum EStoreEvents {
    Updated = 'updated',
}

class Store extends EventBus {
    private state: IStoreState;
    private initialState: IStoreState;

    constructor(initialState: IStoreState = {}) {
        super();
        this.initialState = initialState
        this.state = { ...initialState };
    }

    public getState(): IStoreState {
        return this.state;
    }

    public setState(state: IStoreState): void {
        this.state = state;
    }

    public set(path: string, value: unknown) {
        set(this.state, path, value);
        this.emit(EStoreEvents.Updated);
    };

    public reset(): void {
        this.state = { ...this.initialState };
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
export const authState = new Store(AUTH_STATE_INITIAL);

const CHATS_STATE_INITIAL
export const chatsState = new Store()

export default Store;
