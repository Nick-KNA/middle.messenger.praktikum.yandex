import { IUserState } from "../store/index";
import fetchService from "./fetchService";

export interface IChangePassword {
    oldPassword: string
    newPassword: string
}

class UserService {
    changeUser(data: Omit<IUserState, 'id' | 'login' | 'avatar'>): Promise<any> {
        return fetchService.put('/user/profile', {
            data
        });
    }
    changePassword(data: IChangePassword): Promise<any> {
        return fetchService.put('/user/password', {
            data
        });
    }
}

const userService = new UserService();

export default userService;
