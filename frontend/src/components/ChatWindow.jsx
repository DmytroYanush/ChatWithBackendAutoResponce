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

    const senderId = user?.uid || user?.email;

    const messagesEndRef = useRef(null);

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

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;

        try {
            await sendMessage(chatId, trimmed, senderId);
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
    
    useEffect(() => {
        if (chatId) {
            getMessages(chatId)
                .then(msgs => {
                    console.log('messages:', msgs);
                    setMessages(msgs);
                })
                .catch((err) => {
                    toast.error('Failed to fetch messages');
                    console.error(err);
                });
        }
    }, [chatId]);

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
                {messages.map((message, i) => {
                    const isOwn = message.sender === senderId;
                    console.log('senderId:', senderId, 'message.sender:', message.sender, 'isOwn:', isOwn);
                    return (
                        <div
                            key={i}
                            className={`chat-message-wrapper ${message.sender === 'bot' ? 'bot' : isOwn ? 'user' : 'other'}`}
                        >
                            <div className={`chat-message ${message.sender === 'bot' ? 'bot' : isOwn ? 'user' : 'other'}`}>
                                {editingId === message._id ? (
                                    <>
                                        <input
                                            value={editText}
                                            onChange={e => setEditText(e.target.value)}
                                            style={{ width: '80%' }}
                                        />
                                        <button onClick={() => handleEditSave(message)} style={{ marginLeft: 4 }}>💾</button>
                                        <button onClick={handleEditCancel} style={{ marginLeft: 2 }}>✕</button>
                                    </>
                                ) : (
                                    <>
                                        <div className="message-text" style={{ display: 'flex', alignItems: 'center' }}>
                                            {message.text}
                                            {isOwn && (
                                                <button
                                                    onClick={() => handleEdit(message)}
                                                    style={{
                                                        marginLeft: 8,
                                                        fontSize: 14,
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                        color: '#888',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        height: 20,
                                                        width: 20
                                                    }}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={`message-time ${message.sender === 'bot' ? 'bot' : isOwn ? 'user' : 'other'}`}>
                                {new Date(message.createdAt).toLocaleString('en-US', {
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
            <form onSubmit={handleSubmit} className="chat-input-area">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
                <AutoMessageButton compact user={user} />
            </form>
            <ToastContainer />
        </div>
    );
}

export default ChatWindow;
