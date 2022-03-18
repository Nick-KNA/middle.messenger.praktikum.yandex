import fetchService, { TResponse } from "./fetchService"
import { authState, IUserState } from "../store/index";
import { Router } from "../utils/router";

export type TRegisterData = {
	first_name: string,
	second_name: string,
	login: string,
	email: string,
	password: string,
	phone: string
};

class AuthService {
	private router: Router;
	checkRouter(): void {
		if (!this.router) {
			this.router = new Router();
		}
	}
	login(login: string, password: string): Promise<TResponse<any>> {
		return fetchService.post('/auth/signin', {
			data: {
				login,
				password,
			}
		});
	}
	me(): Promise<IUserState | null> {
		this.checkRouter();
		return fetchService.get('/auth/user').then(
			(response: TResponse<IUserState>): Promise<IUserState | null> => {
				if (!response.status) {
					this.router.go('/login');
					return Promise.resolve(null);
				}
				authState.setState({
					isLoggedIn: true,
					user: response.data
				});
				return Promise.resolve(response.data);
			},
			(error: any): null => {
				console.log(error);
				this.router.go('/500');
				return null;
			}
		);
	}
	register(data: TRegisterData): Promise<any> {
		return fetchService.post('/auth/signup', {
			data
		});
	}
	logout(): Promise<any> {
		return fetchService.post('/auth/logout');
	}
}

const authService = new AuthService();

export default authService;
