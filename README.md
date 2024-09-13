
# UserTaskHub


A Node.js application for user authentication and task management, allowing users to create, update, and delete tasks with access control.


## Features
- User management: Create, update, and delete users.
- User registration and authentication (log in/log out).
- Task management: Create, update, and delete tasks.
- Access control to ensure users can only manage their own tasks.


## Roadmap

- Step 1: Clone the Repository. 
- Step 2: Navigate to the Project Directory.
- Step 3: Install Dependencies.
    - Make sure you have Node.js installed, then run:
    ```
    npm i express
    npm i mongoose
    npm i validator
    npm i jsonwebtoken
    npm i bcryptjs
    npm i nodemon --save-dev
    ```
- Step 4: Start MongoDB Server
- Step 5: Start the Application ``` npm start ```
- Step 6: Open in Browser or Use API Client 
    - The application will run at ```http://localhost:3000```
    - Use Postman or another API client to interact with the REST API.




## API Reference

#### Create all Users.

```http
  POST /users
```

#### Get all users.

```http
  GET /users
```
#### Log in an existing user.
```http
 POST /users/login
````
#### Check Current Login User
```http
 GET /auth 
```
#### Log out
```http
 POST /users/logout
```
#### Log out all seasons
``` http
 POST /users/logoutAll
```
#### Update log in user
```http
 PATCH /users/update
```
#### Delete log in user
```http
 DELETE /users/delete
```
#### Create a task
``` http
 POST /task
```
#### Get all tasks for the logged-in user
```http
 GET /task
```
#### Get limited tasks by pagination and sorting
```http
 GET /task?limit=2&skip=2&creadteAt_desc
 GET /task?limit=2&skip=2&creadteAt_asc
```
#### Get a particular task with id
```http
 GET /task/:id
```
#### Update a task by ID
```http
 PATCH /task/:id
```
#### Delete a task by ID
```http 
 DELETE /task/:id 
```



## Purpose of the Application
The UserTaskHub is designed to provide a simple and efficient way for users to manage their daily tasks. Users can securely register, log in, and perform task-related actions while ensuring that each user's data is isolated and protected from other users.