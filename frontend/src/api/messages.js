const API_URL = 'http://localhost:5000/api/messages';

export async function getMessages(chatId) {
  const res = await fetch(`${API_URL}/${chatId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch messages');
  }
  return res.json();
}

export async function sendMessage(chatId, text) {
  const res = await fetch(`${API_URL}/${chatId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to send message');
  }

  return res.json();
}


