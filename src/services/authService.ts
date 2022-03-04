import fetchService, { TResponse } from "./fetchService"

export type TRegisterData = {
	first_name: string,
	second_name: string,
	login: string,
	email: string,
	password: string,
	phone: string
};

class AuthService {
	login(login: string, password: string): Promise<TResponse<any>> {
		return fetchService.post('/auth/signin', {
			data: {
				login,
				password,
			},
			headers: {
				'Content-Type': 'application/json',
			}
		});
	}
	me(): Promise<any> {
		return fetchService.get('/auth/user');
	}
	register(data: TRegisterData): Promise<any> {
		return fetchService.post('/auth/signup', {
			data
		});
	}
}

const authService = new AuthService();

export default authService;
