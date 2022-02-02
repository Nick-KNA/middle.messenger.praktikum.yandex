import Block, { TProps } from '../block/block';
import { compile as pugCompile } from 'pug';

const image = new URL('../../../static/images/next.svg', import.meta.url);

const pugString = `
input.new-message__input(placeholder="Сообщение")
.new-message__send
	img(src="${image}")
`

const templateRender = pugCompile(pugString);

class NewMessage extends Block {
	constructor(props?: TProps) {
		super('div', {
			...props,
		});
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}

	_addAttributes() {
		this.element.classList.add('new-message');
	}
}

export default NewMessage;
