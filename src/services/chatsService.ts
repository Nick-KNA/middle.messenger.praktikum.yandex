import fetchService from "./fetchService"

class ChatsService {
    fetchChatsList(): Promise<any> {
        return fetchService.get('/chats', {
            data: {
                offset: 0,
                limit: 10,
            }
        });
    }
    addNewChat(name: string): Promise<any> {
        return fetchService.post('/chats', {
            data: {
                title: name
            }
        });
    }
    fetchWSToken(id: string): Promise<any> {
        return fetchService.post(`/chats/token/${id}`);
    }
    fetchChatUsers(chatId: string): Promise<any> {
        return fetchService.get(`/chats/${chatId}/users`);
    }
    addNewUser(id: string, chatId: string): Promise<any> {
        return fetchService.put('/chats/users', {
            data: {
                users: [ +id ],
                chatId: +chatId
            }
        });
    }
}

const chatsService = new ChatsService();

export default chatsService;
