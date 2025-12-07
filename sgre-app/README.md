# SGRE App

## Description
SGRE App is a comprehensive resource and event management system designed to streamline the management of resources, events, and user interactions. The application is structured to support different user roles, including Admin, Manager, and Client, each with tailored functionalities.

## Features
- **User Authentication**: Secure login and registration for users.
- **Role-Based Access**: Different functionalities based on user roles (Admin, Manager, Client).
- **Resource Management**: Manage rooms, equipment, and vehicles efficiently.
- **Event Planning**: Organize and manage events with participant tracking.
- **Reservation System**: Smart reservation system with conflict detection.
- **Analytics and Reporting**: Detailed reports on resource usage and event statistics.

## Project Structure
```
sgre-app
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── contexts
│   │   ├── layouts
│   │   ├── pages
│   │   └── services
│   └── public
├── backend
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the frontend directory:
   ```
   cd sgre-app/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Navigate to the backend directory:
   ```
   cd ../backend
   ```
5. Install backend dependencies:
   ```
   npm install
   ```

## Usage
1. Start the backend server:
   ```
   node server.js
   ```
2. Start the frontend application:
   ```
   npm run dev
   ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.