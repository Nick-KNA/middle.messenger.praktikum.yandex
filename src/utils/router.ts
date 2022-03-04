import Block from "../components/block/block";
import { renderToDOM } from "./domUtils";

function isEqual(lhs: any, rhs: any): boolean {
	return lhs === rhs;
}

const ROOT_QUERY = '.root';

export class Route {
	private _pathname: string;
	private _block: Block;

	constructor(pathname: string, block: Block) {
		this._pathname = pathname;
		this._block = block;
		block.hide();
		renderToDOM(ROOT_QUERY, block);
	}

	navigate(pathname: string) {
		if (this.match(pathname)) {
			this.render();
		}
	}

	leave() {
		if (this._block) {
			this._block.hide();
		}
	}

	match(pathname: string): boolean {
		return isEqual(pathname, this._pathname);
	}

	render() {
		this._block.show();
	}
}

export class Router {
	private _defaultPath: string
	private routes: Route[];
	private _currentRoute: Route | null;
	private history: History;
	static _instance: Router;

	constructor(defaultPath?: string) {
		if (Router._instance) {
			return Router._instance;
		}
		this._defaultPath = defaultPath || '/';
		this.routes = [];
		this.history = window.history;
		this._currentRoute = null;

		window.addEventListener('popstate', (_event) => {
			const state = this.history.state || {};
			this._onRoute(state.path || '/');
		});

		Router._instance = this;
	}

	setDefaultPath(defaultPath: string): Router {
		this._defaultPath = defaultPath;
		return this;
	}

	use(pathname: string, block: Block) {
		const route = new Route(pathname, block);
		this.routes.push(route);
		return this;
	}

	start() {
		this._onRoute('/');
	}

	_onRoute(pathname: string): void {
		const route = this.getRoute(pathname);
		if (!route) {
			this.go('/404');
			return;
		}

		if (this._currentRoute) {
			this._currentRoute.leave();
		}

		this._currentRoute = route;
		route.render();
	}

	go(pathname: string): void {
		const targetPath = pathname === '/' ? this._defaultPath : pathname;
		console.log('targetPath', targetPath);
		history.pushState({ path: targetPath }, '', targetPath);
		this._onRoute(targetPath);
	}

	back(): void {
		this.history.back();

	}

	forward(): void {
		this.history.forward();
	}

	getRoute(pathname: string): Route | null {
		return this.routes.find(route => route.match(pathname)) || null;
	}
}
