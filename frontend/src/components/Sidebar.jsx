import { useState, useEffect } from 'react';
import { getChats, createChat, updateChat, deleteChat } from '../api/chats';
import { getMessages } from '../api/messages';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase';
import './Sidebar.css';

function Sidebar({ onSelect, user }) {
  const [chats, setChats] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [search, setSearch] = useState('');
  const [lastDates, setLastDates] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    const fetchChatsWithLastDates = async () => {
      const chatList = await getChats();
      setChats(chatList);

      const dateMap = {};
      for (const chat of chatList) {
        const messages = await getMessages(chat._id);
        if (messages.length > 0) {
          const last = messages[messages.length - 1];
          dateMap[chat._id] = new Date(last.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      }
      setLastDates(dateMap);
    };

    fetchChatsWithLastDates();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleCreateChatFromSearch = async () => {
    if (!user) return alert('You must be logged in to create a chat.');
    if (!search.trim()) return;
    const [first, ...rest] = search.trim().split(' ');
    const last = rest.join(' ') || ' ';
    await createChat(first, last);
    const updatedChats = await getChats();
    setChats(updatedChats);
    const created = updatedChats.find(c => c.firstName === first && c.lastName === last);
    if (created) onSelect(created);
    setSearch('');
  };

  const handleUpdate = async (id) => {
    if (!user) return;
    await updateChat(id, editFirstName, editLastName);
    setEditingId(null);
    setChats(await getChats());
  };

  const handleDelete = async (id) => {
    if (!user) return;
    try {
      await deleteChat(id);
      setChats(prev => prev.filter(chat => chat._id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const filteredChats = chats.filter(chat =>
    `${chat.firstName} ${chat.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const chatExists = filteredChats.length > 0;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !chatExists) {
      handleCreateChatFromSearch();
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-login">
          {user ? (
            <>
              <img src={user.photoURL} alt=" " />
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <button onClick={handleLogin}>Log in</button>
          )}
        </div>
        <div className="search-container">
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or start new chat"
          />
          {!chatExists && search.trim() && user && (
            <button className="create-inline" onClick={handleCreateChatFromSearch}>Create</button>
          )}
        </div>
      </div>

      <h4 className="sidebar-title">Chats</h4>

      {!user ? (
        <p style={{ padding: '10px', color: 'gray' }}>Log in to view and manage chats.</p>
      ) : (
        <ul className="chat-list">
          {filteredChats.map((chat) => (
            <li key={chat._id} className="chat-item">
              {editingId === chat._id ? (
                <div className="edit-mode">
                  <label>
                    <span className="edit-label">First Name</span>
                    <input
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                    />
                  </label>
                  <label>
                    <span className="edit-label">Last Name</span>
                    <input
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                    />
                  </label>
                  <button onClick={() => handleUpdate(chat._id)}>💾</button>
                  <button onClick={() => setEditingId(null)}>❌</button>
                </div>
              ) : (
                <div className="chat-info">
                  <div onClick={() => onSelect(chat)} className="chat-text">
                    <span className="chat-name">{chat.firstName} {chat.lastName}</span>
                    {lastDates[chat._id] && (
                      <div className="chat-date">{lastDates[chat._id]}</div>
                    )}
                  </div>
                  {user && !chat.isPredefined && (
                    <div className="chat-actions">
                      <button onClick={() => {
                        setEditingId(chat._id);
                        setEditFirstName(chat.firstName);
                        setEditLastName(chat.lastName);
                      }}>✏️</button>
                      {deleteConfirmId === chat._id ? (
                        <div className="delete-confirmation">
                          <button onClick={() => handleDelete(chat._id)} className="confirm-delete">✓</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="cancel-delete">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirmId(chat._id)}>🗑️</button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Sidebar;
