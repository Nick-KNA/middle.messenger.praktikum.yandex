import Block from "../components/block/block";

export const renderToDOM = (query: string, block: Block): Element | null => {
	const root = window.document.querySelector(query);
	if (!root) {
		console.error('Failed to render block to DOM, wrong selector');
		return null
	}
	root.appendChild(block.getContent());
	return root;
}
