import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './styles/chat.css';

function App() {
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <div className="app">
            <Sidebar onSelect={setSelectedChat} />
            <main className="chat-window">
                {selectedChat ? (
                    <>
                        <div className="chat-header">
                            {selectedChat.firstName} {selectedChat.lastName}
                        </div>
                        <ChatWindow chatId={selectedChat._id} />
                    </>
                ) : (
                    <div className="chat-header">Select a chat to start messaging</div>
                )}
            </main>
        </div>
    );
}

export default App;
