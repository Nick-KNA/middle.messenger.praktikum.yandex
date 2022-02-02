import Chat from '../../components/chat/chat';
import ChatList from '../../components/chatList/chatList';
import NewMessage from '../../components/newMessage/newMessage';
import { renderToDOM } from '../../utils/domUtils';

const chatLists = new ChatList();
const chat = new Chat();
const newMessage = new NewMessage();

renderToDOM('.chat-list__chats', chatLists);
renderToDOM('.chat-area__messages', chat);
renderToDOM('.chat-area__new-message', newMessage);
