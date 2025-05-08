const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api/chats`;

export async function getChats() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch chats');
  return res.json();
}

export async function createChat(firstName, lastName, sender) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, sender }),
  });
  if (!res.ok) throw new Error('Failed to create chat');
  return res.json();
}

export async function updateChat(id, firstName, lastName) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName }),
  });
  if (!res.ok) throw new Error('Failed to update chat');
  return res.json();
}

export async function deleteChat(chatId) {
  const res = await fetch(`${API_URL}/${chatId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete chat');
  return res.json();
}
