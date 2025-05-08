import { useEffect, useState } from 'react';
import { getMessages, sendMessage } from '../api/messages';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/chatwindow.css';
import AutoMessageButton from './AutoMessageButton';

function ChatWindow({ chatId, chatName }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        if (chatId) {
            getMessages(chatId)
                .then(setMessages)
                .catch((err) => {
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

            // Auto-response wait
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
                {messages.map((message, i) => (
                    <div
                        key={i}
                        className={`chat-message-wrapper ${message.sender === 'bot' ? 'bot' : 'user'}`}
                    >
                        <div className={`chat-message ${message.sender}`}>
                            <div className="message-text">{message.text}</div>
                        </div>
                        <div className={`message-time ${message.sender}`}>
                            {new Date(message.createdAt).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </div>
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
                <AutoMessageButton compact />
            </form>

            <ToastContainer />
        </div>
    );
}

export default ChatWindow;
