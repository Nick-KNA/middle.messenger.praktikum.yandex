import Block, { TProps } from "../../src/components/block/block"

class BlockMock extends Block {
    constructor(props?: TProps) {
        super('div', props);
    }
    show(): void { }
    hide(): void { }
}

export default BlockMock;
