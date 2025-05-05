import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import { useState } from 'react';

function App() {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <div>
      <ChatList onSelect={setSelectedChatId} />
      {selectedChatId && <ChatWindow chatId={selectedChatId} />}
    </div>
  );
}

export default App;


