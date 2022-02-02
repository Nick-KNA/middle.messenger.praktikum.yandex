export type TChatMessage = {
	isYourMessage: boolean
	text: string
	time: Date
}

export type TChatListItemRaw = {
	id: string
	name: string
	lastMessage: {
		time: Date
		text: string
	}
	newMessages: number
	messages: TChatMessage[]
}

const knockKnockJoke = `Knock, knock!
Who's there?
Rufus.
Rufus who?
Rufus the most important part of your house.
`

export const ChatListMock: TChatListItemRaw[] = [
	{
		id: '1001',
		name: 'Александр Миронов',
		newMessages: 0,
		lastMessage: {
			time: new Date(),
			text: 'So what do you think about it? Mind if i try?'
		},
		messages: [
			{
				isYourMessage: true,
				text: 'Hello, knock knock joke time',
				time: new Date()
			},
			{
				isYourMessage: false,
				text: 'Oh hello, nice, shoot it',
				time: new Date()
			},
			{
				isYourMessage: true,
				text: knockKnockJoke,
				time: new Date()
			},
			{
				isYourMessage: false,
				text: 'This is hillarious',
				time: new Date()
			},
			{
				isYourMessage: false,
				text: 'I think i need to make up one of this jokes by myself',
				time: new Date()
			},
			{
				isYourMessage: false,
				text: 'So what do you think about it? Mind if i try?',
				time: new Date()
			},
		]
	},
	{
		id: '1002',
		name: 'Сергей Коптев',
		newMessages: 2,
		lastMessage: {
			time: new Date(),
			text: 'Lore ipsum lore ipsum lore ipsum lore ipsum lore ipsum'
		},
		messages: [
			{
				isYourMessage: true,
				text: 'Привет',
				time: new Date()
			},
			{
				isYourMessage: false,
				text: 'Привет',
				time: new Date()
			}
		]
	},
	{
		id: '1003',
		name: 'Петр Чугунов',
		newMessages: 0,
		lastMessage: {
			time: new Date(),
			text: 'And then all of the sudden it was pitch dark and the night came'
		},
		messages: [
			{
				isYourMessage: true,
				text: 'Привет',
				time: new Date()
			},
			{
				isYourMessage: false,
				text: 'Привет',
				time: new Date()
			}
		]
	},
	{
		id: '1004',
		name: 'Рената Петрова',
		newMessages: 1,
		lastMessage: {
			time: new Date(),
			text: 'Lore ipsum lore ipsum'
		},
		messages: [
			{
				isYourMessage: true,
				text: 'Привет',
				time: new Date()
			},
			{
				isYourMessage: false,
				text: 'Привет',
				time: new Date()
			}
		]
	},
	{
		id: '1005',
		name: 'Алексей Салихов',
		newMessages: 0,
		lastMessage: {
			time: new Date(),
			text: 'Lore ipsum lore ipsum'
		},
		messages: [
			{
				isYourMessage: true,
				text: 'Привет',
				time: new Date()
			},
			{
				isYourMessage: false,
				text: 'Привет',
				time: new Date()
			}
		]
	},
];
