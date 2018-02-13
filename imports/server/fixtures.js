import { Posts, Chats } from './collections'

const posts = [{ text: 'First post' }, { text: 'The end' }]
const chats = [{ text: 'Hello world!' }, { text: 'Are you OK?' }, { text: '就这样吧' }]

const hasPost = Posts.findOne()
const hasChat = Chats.findOne()

if (!hasPost) {
  posts.map(i => Posts.insert(i))
}

if (!hasChat) {
  chats.map(i => Chats.insert(i))
}
