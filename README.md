## Backend Service
This is the backend service for the Problems and Solutions platform, providing a RESTful API for managing problems, solutions, and associated data.

#### Features
- RESTful API for CRUD operations on problems and solutions.
- Pagination, filtering, and sorting.
- Integration with a MongoDB database.
- OpenAPI documentation for API endpoints.

#### Tech Stack
- Node.js with TypeScript for the backend framework.
- Express.js for routing.
- MongoDB as the database.
- Mongoose for object data modeling (ODM).
- Swagger (OpenAPI) for API documentation.
- Jest for testing.

#### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/panda-zw/problems-database-backend.git
    cd backend

2. Install dependencies:
    ```bash
    npm install

3. Create a `.env` file in the root directory with the following variables:
    ```bash
    PORT=5001
    MONGO_URI=mongodb://localhost:27017/problems-db

4. Start the development server:
    ```bash
    npm run dev


### API Documentation
- The API documentation is available via OpenAPI. After starting the server, you can access it at:
    ```bash
    http://localhost:5001/api-docs

### Scripts
- `npm run dev`: Start the server in development mode.
- `npm run build`: Build the project.
- `npm start`: Start the server in production mode.
- `npm test`: Run the test suite.


### Directory Structure
- Directory structure for the project
    ```plaintext
    backend/
    ├── src/
    │   ├── controllers/        # Request handlers
    │   ├── models/             # Mongoose models
    │   ├── routes/             # API routes
    │   ├── middlewares/        # Middleware functions
    │   ├── utils/              # Utility functions
    │   └── server.ts           # Entry point
    ├── .env                    # Environment variables
    ├── package.json            # Dependencies and scripts
    ├── tsconfig.json           # TypeScript configuration
    ├── LICENSE                 # License file
    └── README.md               # Documentation


### License
This project is licensed under the [MIT License](LICENSE).


    
