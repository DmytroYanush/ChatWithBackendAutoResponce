import { useState, useEffect } from 'react';
import { getChats, createChat, updateChat, deleteChat } from '../api/chats';
import './Sidebar.css'; 

function Sidebar({ onSelect }) {
  const [chats, setChats] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [search, setSearch] = useState('');

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

  const filteredChats = chats.filter(chat =>
    `${chat.firstName} ${chat.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search or start new chat"
        />
        {/* Можна додати логін-кнопку */}
        <button className="login-button">Log in</button>
      </div>

      <div className="new-chat">
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
        <button onClick={handleCreate}>Create</button>
      </div>

      <ul className="chat-list">
        {filteredChats.map((chat) => (
          <li key={chat._id} className="chat-item">
            {editingId === chat._id ? (
              <div className="edit-mode">
                <input
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
                <input
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
                <button onClick={() => handleUpdate(chat._id)}>💾</button>
                <button onClick={() => setEditingId(null)}>❌</button>
              </div>
            ) : (
              <div className="chat-info">
                <span className="chat-name" onClick={() => onSelect(chat)}>
                  {chat.firstName} {chat.lastName}
                </span>
                <div className="chat-actions">
                  <button
                    onClick={() => {
                      setEditingId(chat._id);
                      setEditFirstName(chat.firstName);
                      setEditLastName(chat.lastName);
                    }}
                  >✏️</button>
                  <button onClick={() => handleDelete(chat._id)}>🗑️</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
