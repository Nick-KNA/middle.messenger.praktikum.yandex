export type TCallback = (...args: any[]) => void;
export type TListners = Record<string, TCallback[]>;

class EventBus {
	listeners: TListners
	constructor() {
		this.listeners = {} as TListners;
	}

	on(event: string, callback: TCallback): void {
		if (!this.listeners[event]) {
			this.listeners[event] = [] as TCallback[];
		}

		this.listeners[event].push(callback);
	}

	off(event: string, callback: TCallback): void {
		if (!this.listeners[event]) {
			throw new Error(`Нет события: ${event}`);
		}

		this.listeners[event] = this.listeners[event].filter(
			listener => listener !== callback
		);
	}

	emit(event: string, ...args: any[]): void {
		if (!this.listeners[event]) {
			throw new Error(`Нет события: ${event}`);
		}

		this.listeners[event].forEach(function(listener) {
			listener(...args);
		});
	}
}

export default EventBus;
