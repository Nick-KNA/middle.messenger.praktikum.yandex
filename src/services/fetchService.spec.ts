import authService from "./authService"
import HistoryMock from "../../test/mocks/historyMock"
import DocumentMock from "../../test/mocks/documentMock"
import { Router } from "../utils/router"
import BlockMock from "../../test/mocks/blockMock"

describe('Fetch service test', () => {
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

    it('Should fire post request', (done) => {
        void authService.login('temp', 'temp').then(
            () => {
                done();
            },
            () => {
                done();
            }
        );
    })
})