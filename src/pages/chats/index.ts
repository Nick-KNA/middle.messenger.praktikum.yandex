import ChatList from '../../components/ChatList/chatList';
import { renderToDOM } from '../../utils/domUtils';

const chatLists = new ChatList({});

renderToDOM('.chat-list', chatLists);
