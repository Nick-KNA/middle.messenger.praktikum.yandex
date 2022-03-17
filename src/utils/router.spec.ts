import { expect } from "chai"
import HistoryMock from "../../test/mocks/historyMock"
import { Router } from "./router"
import BlockMock from "../../test/mocks/blockMock"
import DocumentMock from "../../test/mocks/documentMock"

describe('Router tests', () => {
    let router: Router;

    before(() => {
        global.window = {
            history: new HistoryMock(),
            addEventListener: (): void => {},
            document: new DocumentMock()
        }
        router = new Router();
        router
            .use('/register', new BlockMock())
            .use('/login', new BlockMock())
            .use('/404', new BlockMock())
            .use('/500', new BlockMock());
    });

    after(() => {
        router.destroyInstance();
    });

    it('Should match history length', () => {
        const currentLength = global.window.history.length;
        const routesToGo = ['/login', '/register'];
        routesToGo.forEach((route: string) => {
            router.go(route);
        })

        expect(global.window.history.length).equal(routesToGo.length + currentLength);
    });

    it('should navigate back', () => {
        router.go('/login');
        router.go('/register');
        router.back();

        expect(global.window.history.state.url).equal('/login');
    });

    it('should navigate forward', () => {
        router.go('/register');
        router.back();
        router.forward();

        expect(global.window.history.state.url).equal('/register');
    });
})