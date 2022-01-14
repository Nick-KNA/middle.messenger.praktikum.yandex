import Profile from '../../modules/profile/profile';
import NavigateButton from '../../modules/navigateButton/navigateButton';

const navigateBtn = new NavigateButton('img[data-ref="navigate"]', 'profile');

class ProfileEdit extends Profile {
	constructor() {
		super([
			'email',
			'login',
			'first_name',
			'second_name',
			'nickname',
			'phone',
		]);
	}
	metadata = {
		requiredFields: [
			{ name: 'email', text: '' },
			{ name: 'login', text: '' },
			{ name: 'first_name', text: '' },
			{ name: 'second_name', text: '' },
			{ name: 'nickname', text: '' },
			{ name: 'phone', text: '' },
		]
	}
}

const profile = new ProfileEdit();
