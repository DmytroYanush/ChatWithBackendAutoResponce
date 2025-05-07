import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import './styles/chat.css';

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
        </div>
    );
}

export default App;
