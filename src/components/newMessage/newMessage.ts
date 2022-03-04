import Block, { TCallback, TComponentConstructor, TProps } from "../block/block"
import { compile } from 'pug';
import { TInputChangeEvent } from '../formInput/formInput';
import Validation from '../../utils/validation';

const image = new URL('../../../static/images/next.svg', import.meta.url);

const pugString = `
input.new-message__input(name="message" data-ref="sendMessageInput" placeholder="Сообщение" value= value)
.new-message__send(data-ref="sendMessage")
	img(src="${image.toString()}")
`

const templateRender = compile(pugString);

class NewMessage extends Block {
	constructor(props?: TProps) {
		super('div', {
			...props,
			value: '',
		});
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}

	_addAttributes() :void {
		this.element.classList.add('new-message');
	}

	_registerListeners(): void {
		this._listeners = [
			{
				selector: 'input[data-ref="sendMessageInput"]',
				event: 'change',
				callback: this.onInputChange.bind(this) as TCallback
			},
			{
				selector: 'div[data-ref="sendMessage"]',
				event: 'click',
				callback: this.onSendMessage.bind(this) as TCallback
			}
		]
	}

	//custom implementation to turn off rerender for the input value change, since the DOM is already synced with our props.value
	componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
		const oldKeys = Object.keys(oldProps);
		const newKeys = Object.keys(newProps);
		if(oldKeys.length !== newKeys.length) {
			return true;
		}
		return oldKeys.reduce((acc, key) => {
			return acc || (key === 'value' ? false : oldProps[key] !== newProps[key]);
		}, false);
	}

	onInputChange(event: TInputChangeEvent): void {
		const {
			value
		} = event.target;
		this.props.value = value;
	}

	onSendMessage(): void {
		const messages = Validation.validateRequired(this.props.value, '');
		if (messages.length === 0) {
			console.log('--------->Sending message<--------');
			console.log(this.props.value);
			// TODO next sprint: add fetch new message logic here
			this.resetState();
		}
	}

	resetState(): void {
		this.props.value = '';
		this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
	}
}

export const constructNewMessage: TComponentConstructor<TProps, NewMessage> = (): NewMessage => new NewMessage();

export default NewMessage;
