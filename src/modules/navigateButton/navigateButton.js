class NavigateButton {
	constructor(selector, path) {
		this.button = document.querySelector(selector);
		if (!this.button) {
			throw new Error('Failed to initialize NavigateButton, wrong selector provided');
		}
		this.button.addEventListener('click', this.onNavigate.bind(this));
		if (!path) {
			throw new Error('Failed to initialize NavigateButton, no target path provided');
		}
		this.targetPath = path
	}
	targetPath = '#';
	onNavigate(){
		window.location.pathname = this.targetPath;
	}
}

export default NavigateButton;
