import EventBus from '../../utils/eventBus';
import { compile as pugCompile, compileTemplate as TCompileTemplate } from 'pug';
import { v4 as uuid } from 'uuid';

export type TChild = {
	key: string
	value: Block
	constructor: TComponentConstructor<TProps, Block>
	props: TProps
};

export type TCallback = (...args: unknown[]) => void

export type TListener = {
	selector: string
	event: string
	callback: TCallback
}

export type TComponentConstructor<T extends TProps, U extends Block> = (props: T) => U;

export type TChildListener = {
	prop: string
	callbackRef: string
}

export type TChildren = {
	[key: string]: {
		component: TComponentConstructor<TProps, Block>, // constructor function, not an instance !!!
		listeners: TChildListener[]
		props: Record<string, any>
	}
}

export type TProps = Record<string, any> & {
	children?: TChildren
};

export type TState = Record<string, any>;

export type IMeta = {
	tagName: string
	props: TProps
}

const pugString = `
<div>block element</div>
`;

const templateRender = pugCompile(pugString);

class Block {
	static EVENTS = {
		INIT: "init",
		FLOW_CDM: "flow:component-did-mount",
		FLOW_CDU: "flow:component-did-update",
		FLOW_RENDER: "flow:render"
	};

	_id: string;
	_element: HTMLElement | null = null;
	_meta: IMeta | null = null;
	_eventBus: EventBus;
	_templateRender: TCompileTemplate;
	_listeners?: TListener[];

	props: TProps; /* self props */
	state: TState;
	childrenProps: {
		[key: string]: TProps
	}
	children: TChild[];
	proxyData: TProps

	constructor(tagName = "div", props: TProps = {}) {
		this._id = uuid();
		this._templateRender = templateRender;
		this.children = []
		this.childrenProps = {};
		this.state = {};

		this._eventBus = new EventBus();

		this._registerChildren(props);
		this._meta = {
			tagName,
			props,
		};

		this.props = this._makePropsProxy(props);

		this._registerEvents(this.eventBus);
		this._registerListeners();
		// this.eventBus.emit(Block.EVENTS.INIT); <--- run this in your component
	}

	_registerChildren(props: TProps): void {
		if (!props.children) {
			return;
		}
		Object.entries(props.children).forEach(([key, value]) => {
			const childProps = { ...value.props };
			if (value.listeners && value.listeners.length > 0) {
				value.listeners.forEach((listener) => {
					const callback = this[listener.callbackRef as keyof Block];
					if (callback && typeof callback === 'function') {
						childProps[listener.prop] = callback.bind(this) as TCallback;
					}
				})
			}
			const component = value.component(childProps);
			this.children.push({
				key: key,
				value: component,
				constructor: value.component,
				props: value.props
			});
			this.childrenProps[key] = component.getProps();
		})
	}

	_childrenPropsToState(): void {
		Object.entries(this.childrenProps).forEach(([key, value]) => {
			this.state[key] = String(value.value);
		});
	}

	_registerEvents(eventBus: EventBus): void {
		eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
		eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
	}

	_registerListeners(): void {
		this._listeners = [];
	}

	_addListners(): void {
		if (!this._listeners) {
			return;
		}
		this._listeners.forEach((item) => {
			const element = !item.selector ? this.element : this.element.querySelector<Element>(item.selector);
			if (!element) {
				console.error(`No element found with this selector: ${item.selector}`);
				return;
			}
			element.addEventListener(item.event, item.callback);
		});
	}

	_removeListners(): void {
		if (!this._listeners) {
			return;
		}
		this._listeners.forEach((item) => {
			const element = !item.selector ? this.element : this.element.querySelector<Element>(item.selector);
			if (!element) {
				return;
			}
			element.removeEventListener(item.event, item.callback);
		});
	}

	_createResources(): void {
		const { tagName } = this._meta as IMeta; //safe assert since constructor filled _meta property
		this._element = this._createDocumentElement(tagName);
		this._addAttributes();
	}

	_addAttributes(): void {
		// customize your this._element here
	}

	init(): void {
		this._createResources();
		this._render();
		this.eventBus.emit(Block.EVENTS.FLOW_CDM);
	}

	_componentDidMount(): void {
		this.componentDidMount();
	}
	
	componentDidMount(): void {
		// add did mount logic of your component here
	}

	dispatchComponentDidMount(): void {
		this.componentDidMount();
	}

	_componentDidUpdate(oldProps: TProps, newProps: TProps): void {
		const isUpdated = this.componentDidUpdate(oldProps, newProps);
		if (isUpdated) {
			this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
		}
	}

	componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		const oldKeys = Object.keys(oldProps);
		const newKeys = Object.keys(newProps);
		if(oldKeys.length !== newKeys.length) {
			return true;
		}
		return oldKeys.reduce((acc, key) => {
			return acc || oldProps[key] !== newProps[key];
		}, false);
	}

	getProps = (): TProps => {
		return this.props;
	}

	setProps = (nextProps: TProps): void => {
		if (!nextProps) {
			return;
		}
		const oldProps = {
			...this.props,
		}
		Object.assign(this.props, nextProps);
		this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, this.props);
	};

	get id(): string {
		return this._id;
	}

	get element(): HTMLElement {
		return this._element as HTMLElement; //safe assert since constructor filled _element property
	}

	get eventBus(): EventBus {
		return this._eventBus;
	}

	_render(): void {
		const block = this.render();
		this.element.innerHTML = '';
		this.element.appendChild(block);
		this._addListners();
	}

	// add your render logic here
	render(): DocumentFragment {
		const renderProps = { ...this.props }

		this.children.forEach((item: TChild): void => {
			renderProps[item.key] = `<div data-stub-id="${item.value.id}"></div>`
		});

		this._removeListners();

		const fragment = this._createDocumentElement<HTMLTemplateElement>('template');
		fragment.innerHTML = this._templateRender(renderProps);

		this.children.forEach((item: TChild): void => {
			const stub = fragment.content.querySelector(`[data-stub-id="${item.value.id}"]`);
			if (!stub) {
				console.error(`Can't find stub with id ${item.value.id}`);
				return;
			}
			// item.value.setProps(this.childrenProps[item.key]);
			stub.replaceWith(item.value.getContent());
		});

		return fragment.content;
	}

	getContent(): HTMLElement {
		return this.element;
	}

	_makePropsProxy(props: Record<string, string | number>): Record<string, string | number> {
		const eventBus = this.eventBus;
		this.proxyData = new Proxy(props, {
			set(target: TProps, prop: keyof TProps, value: string): boolean {
				const oldProps = {...target};
				target[prop] = value;
				eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);
				return true;
			},
			get(target: TProps, prop: keyof TProps): TProps[keyof TProps] {
				const value = target[prop] as string | number | TChildren;
				return value;
			},
			deleteProperty() {
				throw new Error('нет доступа');
			},
		});

		return this.proxyData;
	}

	_createDocumentElement<T extends HTMLElement>(tagName: string): T {
		return document.createElement(tagName) as T;
	}

	show(): void {
		const element = this.getContent();
		element.style.display = "block";
	}

	hide(): void {
		const element = this.getContent();
		element.style.display = "none";
	}

	static getInputListeners(): TChildListener[] {
		return [
			{ prop: 'onChange', callbackRef: 'onInputChange' },
			{ prop: 'onFocus', callbackRef: 'onInputFocus' },
			{ prop: 'onBlur', callbackRef: 'onInputBlur' }
		];
	}
}

export default Block;
