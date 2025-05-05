import { useState, useEffect } from 'react';
import { getChats, createChat, updateChat, deleteChat } from '../api/chats';

function ChatList({ onSelect }) {
  const [chats, setChats] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');

  useEffect(() => {
    getChats().then(setChats);
  }, []);

  const handleCreate = async () => {
    if (!firstName || !lastName) return;
    await createChat(firstName, lastName);
    setChats(await getChats());
    setFirstName('');
    setLastName('');
  };

  const handleUpdate = async (id) => {
    await updateChat(id, editFirstName, editLastName);
    setEditingId(null);
    setChats(await getChats());
  };

  const handleDelete = async (id) => {
    await deleteChat(id);
    setChats(prev => prev.filter(chat => chat._id !== id));
  };

  return (
    <div>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />
      <button onClick={handleCreate}>Create Chat</button>

      <ul>
        {chats.map((chat) => (
          <li key={chat._id}>
            {editingId === chat._id ? (
              <>
                <input
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
                <input
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
                <button onClick={() => handleUpdate(chat._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span onClick={() => onSelect(chat._id)}>
                  {chat.firstName} {chat.lastName}
                </span>
                <button
                  onClick={() => {
                    setEditingId(chat._id);
                    setEditFirstName(chat.firstName);
                    setEditLastName(chat.lastName);
                  }}
                >✏️</button>
                <button onClick={() => handleDelete(chat._id)}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;
