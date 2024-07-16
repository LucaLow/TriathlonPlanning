# Calendar Event Management System

This project is a Calendar Event Management System that allows users to create, view, and delete training events. The system is built using React for the frontend and Node.js with Express for the backend. It also includes user authentication using JSON Web Tokens (JWT).

## Features

- User authentication (login and signup)
- View calendar with events
- Create new events
- Delete events
- Persist data in a MySQL database

## Prerequisites

- Node.js
- MySQL
- React
- Ant Design

## Getting Started

### Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install the backend dependencies:
   ```sh
   cd backend
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following content:
   ```
   DATABASEHOST=your_database_host
   DATABASEUSER=your_database_user
   DATABASEPASSWORD=your_database_password
   USERSECRETKEY=your_jwt_secret_key
   ```

4. Start the backend server:
   ```sh
   node server.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```

2. Install the frontend dependencies:
   ```sh
   npm install
   ```

3. Start the frontend server:
   ```sh
   npm start
   ```

## Project Structure

### Backend

- `server.js`: Main server file, defines API endpoints.
- `package.json`: Contains backend dependencies and scripts.
- `.env`: Environment variables for database and JWT.

### Frontend

- `src/CalendarView.js`: Main React component for the calendar view.
- `src/CreateEventModal.js`: React component for creating new events.
- `src/App.js`: Main application file.
- `src/index.js`: Entry point for the React application.
- `src/CalenderView.css`: CSS file for styling the calendar view.
- `package.json`: Contains frontend dependencies and scripts.

## API Endpoints

### Authentication

- `POST /login`: Authenticates a user and returns a JWT token.
- `POST /signup`: Registers a new user and returns a JWT token.

### Event Management

- `POST /GetEvent`: Retrieves events for the authenticated user.
- `POST /CreateEvent`: Creates a new event for the authenticated user.
- `POST /RemoveEvent`: Deletes an event for the authenticated user.

## Usage

### Authentication

1. Navigate to the login page.
2. Enter your username and password to log in.
3. If you don't have an account, go to the signup page to create a new account.

### Managing Events

1. Right-click on a date in the calendar to open the event creation modal.
2. Fill in the event details and click "OK" to save the event.
3. Click on an event card to view the event details.
4. Click the delete button to remove an event.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Day.js](https://day.js.org/)

Feel free to reach out if you have any questions or suggestions!
