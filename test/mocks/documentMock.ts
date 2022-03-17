export interface IElement {
    appendChild: () => void
}

class DocumentMock {
    constructor() {

    }
    querySelector(): IElement {
        return {
            appendChild: () => { }
        };
    }
}

export default DocumentMock;
