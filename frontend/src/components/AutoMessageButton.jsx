import { useState, useEffect } from 'react';
import { getChats } from '../api/chats';
import { sendMessage } from '../api/messages';
import { toast } from 'react-toastify';

const randomMessages = [
  "Hello! How are you doing today?",
  "Just checking in to see how things are going!",
  "Hope you're having a great day!",
  "Did you see the latest updates?",
  "What's new in your world?",
  "Just wanted to say hi!",
  "How's your day going so far?",
  "Any exciting plans for today?",
  "Just dropping by to say hello!",
  "Hope everything is going well!"
];

function AutoMessageButton({ compact }) {
  const [isActive, setIsActive] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const sendRandomMessage = async () => {
    try {
      const chats = await getChats();
      if (chats.length === 0) return;
      const randomChat = chats[Math.floor(Math.random() * chats.length)];
      const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
      await sendMessage(randomChat._id, randomMessage);
    } catch (error) {
      console.error('Error sending random message:', error);
    }
  };

  const toggleAutoMessage = () => {
    if (isActive) {
      clearInterval(intervalId);
      setIntervalId(null);
      toast.info('Auto-messaging stopped');
    } else {
      const id = setInterval(sendRandomMessage, 30000); // every 30 seconds
      setIntervalId(id);
      toast.info('Auto-messaging started');
    }
    setIsActive(!isActive);
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <button
      style={{
        ...(compact
          ? {
              marginLeft: 8,
              padding: '6px 10px',
              borderRadius: 16,
              fontSize: 12,
              position: 'static',
              boxShadow: 'none',
            }
          : {
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
              padding: '12px 20px',
              borderRadius: 24,
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }),
        background: isActive ? '#f44336' : '#4CAF50',
        color: 'white',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      onClick={toggleAutoMessage}
    >
      {isActive ? 'Stop Auto-Messages' : 'Start Auto-Messages'}
    </button>
  );
}

export default AutoMessageButton;