import { Router } from "../../utils/router"
import HistoryMock from "../../../test/mocks/historyMock"
import DocumentMock from "../../../test/mocks/documentMock"
import BlockMock from "../../../test/mocks/blockMock"
import { expect } from "chai"

describe('Block tests', () => {
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

    it('Should persist props', () => {
        const props = {
            login: 'login',
            password: 'password'
        };
        const block = new BlockMock(props);
        expect(block.props.login).equal(props.login);
        expect(block.props.password).equal(props.password);
    });
});