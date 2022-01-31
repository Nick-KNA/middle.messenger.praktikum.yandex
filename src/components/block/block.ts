import EventBus from '../../utils/eventBus';
import { compile as pugCompile, compileTemplate as TCompileTemplate } from 'pug';
import { v4 as uuid } from 'uuid';

export type TChild = {
	key: string
	value: Block
};

export type TListener = {
	selector: string
	event: string
	callback: (...args: any) => void
}

export type TProps = Record<string, any>;

export type IMeta = {
	tagName: string
	props: TProps
	children: TChild[]
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
	_eventBus: () => EventBus;
	_templateRender: TCompileTemplate;
	_listeners?: TListener[];

	props: TProps;
	children: TChild[];
	proxyData: TProps

	constructor(tagName = "div", props: TProps = {}) {
		this._id = uuid();
		this._templateRender = templateRender;

		const eventBus = new EventBus();
		const children = this._deriveChildren(props);
		this._meta = {
			tagName,
			props,
			children,
		};

		this.props = this._makePropsProxy(props);
		this.children = children;

		this._eventBus = () => eventBus;

		this._registerEvents(eventBus);
		// eventBus.emit(Block.EVENTS.INIT);
	}

	_deriveChildren(props: TProps): TChild[] {
		return Object.entries(props).filter((item: [string, any]): boolean => {
			return item[1] instanceof Block;
		}).map(([key, value]) => {
			return {
				key,
				value
			};
		});
	}

	_registerEvents(eventBus: EventBus): void {
		eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
		eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
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

	_componentDidMount() {
		this.componentDidMount();
	}

	// add did mount logic of your component here
	componentDidMount() {}

	dispatchComponentDidMount() {}

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
		return this._eventBus();
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
				console.error(`Can\'t find stub with id ${item.value.id}`);
				return;
			}
			stub.replaceWith(item.value.getContent());
		});

		return fragment.content;
	}

	getContent(): HTMLElement {
		return this.element;
	}

	_makePropsProxy(props: TProps): TProps {
		this.proxyData = new Proxy(props, {
			set(target: TProps, prop: keyof TProps, value: any): boolean {
				const oldProps = {...target};
				target[prop] = value;
				this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);
				return true;
			},
			get(target: TProps, prop: keyof TProps) {
				const value = target[prop];
				return typeof value === "function" ? value.bind(target) : value;
			},
			deleteProperty(_target: TProps, _prop: keyof TProps) {
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
}

export default Block;
