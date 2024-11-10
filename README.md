# InstaMessage

InstaMessage is a simple messaging application built with Next.js, React, and TypeScript. It allows users to sign up, log in, and send messages to other users.

## Features

- User authentication (login and signup - signup is still a work in progress)
- Send messages to other users
- Real-time user search when composing messages
- API-based input for login and message sending
- Mock database for demonstration purposes

## Technologies Used

- Next.js 13 (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository: git clone [https://github.com/yourusername/instamessage.git](https://github.com/yourusername/instamessage.git)
cd instamessage

2. Install dependencies: npm install OR yarn install

3. Run the development server: npm run dev OR yarn run dev

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### User Credentials

For testing purposes, you can use the following user credentials:

- Username: demo, Password: password
- Username: john, Password: doe
- Username: jane, Password: smith
- Username: example_username, Password: example_password

### Signing Up

1. Navigate to the signup page by clicking "Sign Up" on the login page.
2. Enter a username and password.
3. Click "Sign Up" to create your account.

Note: The signup functionality is still a work in progress and may not function as expected - use given credentials for logging into message

### Logging In

1. On the login page, enter your username and password (use one of the provided test credentials).
2. Click "Log In" to access your account.

### Sending Messages

1. After logging in, you'll be redirected to the message page.
2. Enter the recipient's username and your message.
3. Click "Send Message" to send your message.

### Using API Input

Both the login and message sending functionalities support API-based input:

1. Toggle the "Use API Input" switch.
2. Paste a JSON object with the required fields:
- For login: `{"username": "your_username", "password": "your_password"}`
- For sending messages: `{"recipient": "recipient_username", "message": "Your message here"}`
3. The app will validate the JSON and display a preview if it's valid.

## Project Structure

- `app/`: Next.js 13 app directory
- `api/`: API routes
- `page.tsx`: Main page component
- `components/`: React components
- `login-page.tsx`: Login page component
- `signup-page.tsx`: Signup page component
- `message-page.tsx`: Message page component
- `lib/`: Utility functions and mock database

## Known Limitations

- This project uses a mock database and doesn't persist data between sessions.
- Authentication is simplified and not secure for production use.
- The messaging system is basic and doesn't support real-time updates.
- The signup functionality is currently under development and may not work as expected.

## Future Improvements

- Implement a real database for data persistence
- Add real-time messaging capabilities
- Enhance security features (e.g., password hashing, HTTPS)
- Implement user profiles and friend lists
- Add support for rich media in messages (images, videos, etc.)





