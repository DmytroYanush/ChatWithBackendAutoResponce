const API_URL = 'http://localhost:5000/api/messages';

export async function getMessages(chatId) {
  const res = await fetch(`${API_URL}/${chatId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch messages');
  }
  return res.json();
}

export async function sendMessage(chatId, text, sender) {
  const res = await fetch(`${API_URL}/${chatId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sender }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to send message');
  }

  return res.json();
}

export async function updateMessage(messageId, text, sender) {
  const res = await fetch(`${API_URL}/update/${messageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sender }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to update message');
  }
  return res.json();
}


