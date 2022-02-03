import Block, {TCallback, TProps } from '../block/block';
import { compile } from 'pug';

const image = new URL('../../../static/images/back.svg', import.meta.url);

const pugString = `
img.navigate-back(src="${image.toString()}")
`;

const templateRender = compile(pugString);

class NavigateButton extends Block {
	constructor(props: TProps) {
		super('div', props);
		this._templateRender = templateRender;
		this.eventBus.emit(Block.EVENTS.INIT);
	}
	_registerListeners(): void {
		this._listeners = [
			{
				selector: '',
				event: 'click',
				callback: this.onNavigateClick.bind(this) as TCallback
			}
		];
	}
	onNavigateClick(): void {
		window.location.pathname = String(this.props.targetPath);
	}
}

export default NavigateButton;

