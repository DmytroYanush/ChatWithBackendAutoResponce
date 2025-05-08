const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api') + '/chats';

export async function getChats() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function createChat(firstName, lastName, sender) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, sender }),
  });
  return res.json();
}

export async function updateChat(id, firstName, lastName) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName }),
  });
  return res.json();
}

export async function deleteChat(chatId) {
  const res = await fetch(`${API_URL}/${chatId}`, {
    method: 'DELETE',
  });
  return res.json();
}

