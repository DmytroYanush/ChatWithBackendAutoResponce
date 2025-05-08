import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import './styles/chat.css';
import socket from './socket';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AutoMessageButton from './components/AutoMessageButton';

function App() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setSelectedChat(null); // Clear chat on logout
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
        <div className="app">
            <Sidebar onSelect={setSelectedChat} user={user} />
            <main className="chat-window">
                {user && selectedChat ? (
                    <>
                        <div className="chat-header">
                            {selectedChat.firstName} {selectedChat.lastName}
                        </div>
                        <ChatWindow chatId={selectedChat._id} />
                    </>
                ) : (
                    <div className="chat-header">
                        {user ? 'Select a chat to start messaging' : 'Please log in to use the chat'}
                    </div>
                )}
            </main>
            <ToastContainer position="bottom-right" />
            {/*<AutoMessageButton />*/}
        </div>
    );
}

export default App;
