# Chess Duel Backend

This is the backend for the Chess Duel application, built with Express and TypeScript. It provides a robust foundation for managing chess game logic, user interactions, and data persistence.

## Features

- Express.js server with TypeScript
- PostgreSQL database integration
- User authentication and management
- RESTful API design
- WebSocket support for real-time game updates
- OpenAPI documentation with Swagger UI
- Comprehensive testing setup with Vitest
- Linting and formatting with Biome
- Efficient build process with tsup

## Prerequisites

- Node.js (version specified in `.nvmrc` or latest LTS)
- PostgreSQL

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/edwinhern/express-typescript-2024.git
   cd express-typescript-2024
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment:
   - Copy `.env.template` to `.env`
   - Update the `.env` file with your specific configuration, especially the database connection details

4. Set up the database:
   - Create a PostgreSQL database named `chess_duel`
   - Run migrations:
     ```
     npm run migrate up
     ```
   - Seed the database with initial user data:
     ```
     npm run seed:users
     ```

5. Start the development server:
   ```
   npm run dev
   ```

The server should now be running on `http://localhost:3000` (or the port specified in your .env file).

## Scripts

- `npm run dev`: Start the development server with hot-reloading
- `npm run build`: Build the project for production
- `npm start`: Run the production build
- `npm run clean`: Remove build artifacts and coverage reports
- `npm run lint`: Run linter checks
- `npm run lint:fix`: Run linter and fix issues
- `npm run format`: Format code using Biome
- `npm test`: Run tests using Vitest
- `npm run migrate`: Run database migrations
- `npm run seed:users`: Seed the database with initial user data

## Project Structure

```
src/
├── config/
├── controllers/
├── models/
├── routes/
├── services/
├── utils/
├── seeders/
├── __tests__/
└── index.ts
```

## API Documentation

API documentation is available via Swagger UI. Once the server is running, you can access it at:

```
http://localhost:3000/api-docs
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Zod](https://github.com/colinhacks/zod)
- [Socket.IO](https://socket.io/)

For more information, please refer to the [official repository](https://github.com/edwinhern/express-typescript-2024).