export type TCallback = (...args: unknown[]) => void;
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

	emit(event: string, ...args: unknown[]): void {
		if (!this.listeners[event]) {
			throw new Error(`Нет события: ${event}`);
		}

		this.listeners[event].forEach(function(listener) {
			listener(...args);
		});
	}
}

export default EventBus;
