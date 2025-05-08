# Chat App

A modern, full-stack chat application with guest and registered user support, built with React, Node.js, and MongoDB.

## Features

- **Predefined and User-Created Chats:**  
  - All users (including guests) can view and participate in predefined public chats.
  - Registered users can create, edit, and delete their own chats.

- **Guest Access:**  
  - Unregistered users (guests) can view and send messages in predefined chats.
  - Each guest is assigned a persistent guest ID (stored in localStorage).

- **Authentication:**  
  - Firebase authentication for user registration and login.
  - Google sign-in supported.

- **Messaging:**  
  - Real-time messaging with auto-scroll to the latest message.
  - Only the author of a message can edit their own messages.
  - Messages from guests are marked with their guest ID.

- **Chat Management:**  
  - Predefined chats cannot be edited or deleted.

- **Responsive UI:**  
  - Sidebar with sticky header and chat list scroll.
  - Chat window with sticky chat header and input area.
  - Modern, clean design with color separation for scrollable and fixed areas.

- **Auto-Messages:**  
  - Button to start/stop auto-messages for testing/demo purposes.

## Project Structure

- `/backend` — Node.js/Express API, MongoDB models and controllers.
- `/frontend` — React app with all UI components and API calls.

## Notes

- Guests can only see and write in predefined chats.
- Only the creator of a chat can edit or delete it.
- Only the author of a message can edit it.
- Predefined chats are protected from editing and deletion.
