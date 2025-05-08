import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import './styles/chat.css';
import socket from './socket';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [user, setUser] = useState(null);
    const [guestId, setGuestId] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setSelectedChat(null); // Clear chat on logout
                // Генеруємо guestId, якщо його ще немає
                let gid = localStorage.getItem('guestId');
                if (!gid) {
                    gid = 'guest-' + Math.random().toString(36).slice(2, 10);
                    localStorage.setItem('guestId', gid);
                }
                setGuestId(gid);
            } else {
                setGuestId(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Listen for new-message events
        const handler = (message) => {
            // If the message is for a chat other than the currently open one, show a toast
            if (!selectedChat || message.chatId !== selectedChat._id) {
                toast.info('New message in another chat!');
            }
        };
        socket.on('new-message', handler);
        return () => socket.off('new-message', handler);
    }, [selectedChat]);

    return (
        <div className="app" style={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar onSelect={setSelectedChat} user={user} />
            <main className="chat-window">
                {(user || guestId) && selectedChat ? (
                    <>
                        <div className="chat-header">
                            {selectedChat.firstName} {selectedChat.lastName}
                        </div>
                        <ChatWindow chatId={selectedChat._id} user={user || { uid: guestId }} />
                    </>
                ) : (
                    <div className="chat-header">
                        {user || guestId ? 'Select a chat to start messaging' : 'Please log in to use the chat'}
                    </div>
                )}
            </main>
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default App;
