import { useEffect, useState } from 'react';
import { getMessages, sendMessage } from '../api/messages';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/chatwindow.css'; // Підключення стилів

function ChatWindow({ chatId }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        if (chatId) {
            getMessages(chatId).then(setMessages).catch(err => {
                toast.error('Failed to fetch messages');
                console.error(err);
            });
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
            getMessages(chatId).then(setMessages);

            setTimeout(() => {
                getMessages(chatId).then(setMessages);
            }, 3500);
        } catch (err) {
            toast.error('Failed to send message');
            console.error(err);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.sender}`}>
                        <div className="message-sender">{msg.sender}:</div>
                        <div className="message-text">{msg.text}</div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-input-area">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default ChatWindow;
