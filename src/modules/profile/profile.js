import BaseForm from '../baseForm/baseForm';

class Profile extends BaseForm {
	constructor(inputs) {
		super();
		this.container = document.querySelector('div[data-ref="profileFields"]');
		if(!this.container){
			throw new Error(`Failed to initialize profile, fields container was not found`);
		}
		this.saveButton = document.querySelector('button[data-ref="saveProfile"]');
		if(!this.saveButton){
			throw new Error(`Failed to initialize profile, save profile button was not found`);
		}
		this.saveButton.addEventListener('click', this.onSaveProfile.bind(this));
		
		inputs.forEach((name) => {
			this[`${name}Input`] = this.container.querySelector(`input[name="${name}"]`);
			if(!this[`${name}Input`]){
				throw new Error(`Failed to initialize profile, input with name "${name}" was not found`);
			}
			this[`${name}Label`] = this.container.querySelector(`label[data-ref="${name}"]`);
			if(!this[`${name}Label`]){
				throw new Error(`Failed to initialize profile, input label with data-ref "${name}" was not found`);
			}
			this.state[name] = this[`${name}Input`].getAttribute('value');
			this[`${name}Input`].addEventListener('input', this.onInputChange.bind(this));
		});
	}
	ERROR_CLASS = 'label_red';
	showInputError(name){
		this.showError(this[`${name}Label`]);
	}
	clearInputError(name){
		this.clearError(this[`${name}Label`]);
	}
	showError(element){
		if (!element){
			return;
		}
		element.classList.add(this.ERROR_CLASS);
	}
	clearError(element){
		element.classList.remove(this.ERROR_CLASS);
	}
	onSaveProfile(){
		if (this.isValidForm()) {
			this.fetchSaveProfile();
		}
	}
	fetchSaveProfile(){
		window.location.pathname = 'profile';
	}
}

export default Profile;
