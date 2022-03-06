# Easy Access Web Application.

Easy Access is an application that allows a user to easily access his/her files in any device during a short period of time. The user creates a transfer with the files and accesses them with the transfer´s name and an answer to a personal question. When the user creates an account he/she selects two personal questions, one for private transfers and one for public ones.  

The project is divided into two folders `web` and `server`, hosting the frontend and backend of the application.  
To run the application locally:
1. Run `npm install` in both folders to download dependencies.
2. Run `npm start` in the web folder. This will start a React server.
3. Run `npm build` and then `npm start` to run the backend Node server.

## Prerequisites.
1. You should have a PostgreSQL instance with standard settings and a database named easy_access
2. You should run the database migrations with `npx mikro-orm migration:up`.
