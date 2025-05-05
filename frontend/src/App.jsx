import { useState } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

function App() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div>
      <ChatList onSelect={(chat) => setSelectedChat(chat)} />
      {selectedChat && <ChatWindow chatId={selectedChat._id} />}
    </div>
  );
}

export default App;


