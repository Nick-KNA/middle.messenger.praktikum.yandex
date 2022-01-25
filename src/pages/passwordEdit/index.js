import Profile from '../../modules/profile/profile';
import NavigateButton from '../../modules/navigateButton/navigateButton';

const navigateBtn = new NavigateButton('img[data-ref="navigate"]', 'profile');

class PasswordEdit extends Profile {
	constructor() {
		super([
			'old_password',
			'new_password',
			'new_password_repeat',
		]);
	}
	metadata = {
		requiredFields: [
			{ name: 'old_password', text: '' },
			{ name: 'new_password', text: '' },
			{ name: 'new_password_repeat', text: '' },
		]
	}
	checkFieldValues(){
		if(this.state.new_password !== this.state.new_password_repeat) {
			this.showError(this.new_password_repeatLabel);
			return false;
		}
		return true;
	}
}

const profile = new PasswordEdit();
