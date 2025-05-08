import { useEffect, useState, useRef } from 'react';
import { getMessages, sendMessage, updateMessage } from '../api/messages';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/chatwindow.css';
import AutoMessageButton from './AutoMessageButton';

function ChatWindow({ chatId, chatName, user }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const messagesEndRef = useRef(null);

    const senderId = user?.uid || user?.email || null;

    useEffect(() => {
        if (chatId) {
            getMessages(chatId)
                .then(setMessages)
                .catch((err) => {
                    toast.error('Failed to fetch messages');
                    console.error(err);
                });
        } else {
            setMessages([]); // clear on logout or no chat selected
        }
    }, [chatId, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;

        try {
            await sendMessage(chatId, trimmed, senderId);
            setText('');
            getMessages(chatId).then(setMessages);
            setTimeout(() => getMessages(chatId).then(setMessages), 3500);
        } catch (err) {
            toast.error('Failed to send message');
            console.error(err);
        }
    };

    const handleEdit = (msg) => {
        setEditingId(msg._id);
        setEditText(msg.text);
    };

    const handleEditSave = async (msg) => {
        try {
            await updateMessage(msg._id, editText, senderId);
            setEditingId(null);
            setEditText('');
            getMessages(chatId).then(setMessages);
        } catch (err) {
            toast.error('Failed to update message');
            console.error(err);
        }
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditText('');
    };

    return (
        <div className="chat-container">
            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                {messages.map((msg, i) => {
                    const isOwn = msg.sender === senderId;
                    const isBot = msg.sender === 'bot';

                    return (
                        <div
                            key={i}
                            className={`chat-message-wrapper ${isBot ? 'bot' : isOwn ? 'user' : 'other'}`}
                        >
                            <div className={`chat-message ${isBot ? 'bot' : isOwn ? 'user' : 'other'}`}>
                                {editingId === msg._id ? (
                                    <>
                                        <input
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            style={{ width: '80%' }}
                                        />
                                        <button onClick={() => handleEditSave(msg)} style={{ marginLeft: 4 }}>💾</button>
                                        <button onClick={handleEditCancel} style={{ marginLeft: 2 }}>✕</button>
                                    </>
                                ) : (
                                    <div className="message-text" style={{ display: 'flex', alignItems: 'center' }}>
                                        {msg.text}
                                        {isOwn && (
                                            <button
                                                onClick={() => handleEdit(msg)}
                                                title="Edit"
                                                style={{
                                                    marginLeft: 8,
                                                    fontSize: 14,
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#888'
                                                }}
                                            >
                                                ✏️
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className={`message-time ${isBot ? 'bot' : isOwn ? 'user' : 'other'}`}>
                                {new Date(msg.createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {user && (
                <form onSubmit={handleSubmit} className="chat-input-area">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button type="submit">Send</button>
                    <AutoMessageButton compact user={user} />
                </form>
            )}

            <ToastContainer />
        </div>
    );
}

export default ChatWindow;
