import { useEffect, useState } from 'react';
import { getMessages, sendMessage } from '../api/messages';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ChatWindow({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (chatId) {
      getMessages(chatId).then(setMessages);
    }
  }, [chatId]);

const handleSubmit = async (e) => {
  e.preventDefault();
  const trimmed = text.trim();
  if (!trimmed) return;

  try {
    await sendMessage(chatId, trimmed);
    toast.success('Message sent!');
    setText('');

    // Оновлення повідомлень
    getMessages(chatId).then(setMessages);

    // Через 3.5 сек — оновлення з відповіддю бота
    setTimeout(() => {
      getMessages(chatId).then(setMessages);
    }, 3500);
  } catch (err) {
    toast.error('Failed to send message');
    console.error(err);
  }
};



  return (
    <div>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            <strong>{msg.sender}:</strong> {msg.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your message..."
          required
        />
        <button type="submit">Send</button>
      </form>
	  <ToastContainer />
    </div>
  );
}

export default ChatWindow;
