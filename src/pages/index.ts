import { Router } from "../utils/router";
import loginForm from "./login/index";
import registerForm from "./register/index";
import chatsPage from "./chats/index"
import notFoundPage from "./404/index"
import errorPage from "./500/index"
import profilePage from "./profile/index"
import profileEditPage from "./profileEdit/index"
import profilePasswordEdit from "./passwordEdit/index"

const DEFAULT_PATH = '/register';

const router = new Router();
const path = window.location.pathname;

router
	.setDefaultPath(DEFAULT_PATH)
	.use('/register', registerForm)
	.use('/login', loginForm)
	.use('/chats', chatsPage)
	.use('/404', notFoundPage)
	.use('/500', errorPage)
	.use('/profile', profilePage)
	.use('/profileEdit', profileEditPage)
	.use('/passwordEdit', profilePasswordEdit)
	.go(path);
