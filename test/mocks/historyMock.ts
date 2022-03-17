interface IHistoryState {
    data: Record<string, any>;
    title: string;
    url?: string;
}

class HistoryMock {
    public length: number;
    public state: IHistoryState;
    private history: IHistoryState[];

    private stateIndex: number;

    constructor() {
        this.length = 1;
        this.state = {
            data: {},
            title: '',
            url: '/',
        };
        this.history = [this.state];
        this.stateIndex = 0;
    }

    pushState(data: any, title: string, url?: string) {
        this.length += 1;
        this.state = { data, title, url };
        this.stateIndex += 1;

        this.history.push(this.state);
    }

    forward() {
        this.stateIndex += 1;

        if (this.stateIndex >= this.history.length) {
            throw new Error();
        }

        this.state = this.history[this.stateIndex];
    }

    back() {
        this.stateIndex -= 1;

        if (this.stateIndex < 0) {
            throw new Error();
        }

        this.state = this.history[this.stateIndex];
    }
}

export default HistoryMock;
