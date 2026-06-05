# Project Name

Mini Social Post Application
-simple social post application where users can create accounts, post text or images, view posts from others, like, and comment.

## Features

1. Account Creation
   
-Simple signup and login with email and password.
-Store user details in the database (MongoDB).

2.Create Post

-A user can post text, image, or both.
-Both fields should not be mandatory (either one is enough).

3. Feed

-All posts from all users should be visible in a public feed.
-Display username, post content, likes, and comments count.


4. Like and Comment

-Other users should be able to like or comment on any post.
-Show total likes and comments.
-Save the usernames of people who liked or commented


## Tech Stack

### Frontend

* React.js
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

## Installation

1. Clone the repository

git clone https://github.com/Sakshyyvv/Mini-Social-Post-Application.git

2. Navigate to the project folder

cd backend

3. Install dependencies

npm install mongodb

4. Create a .env file in the root directory and add:

PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


5. Run the Application

Backend:

npm start

Frontend:

npm run dev

## Screenshots 
1. login page
   <img width="1022" height="852" alt="Screenshot_5-6-2026_20214_localhost" src="https://github.com/user-attachments/assets/cbe1f4c0-9194-4067-8a43-2e328e1ec65a" />
2. Home page
   <img width="1111" height="2084" alt="Screenshot_5-6-2026_205144_localhost" src="https://github.com/user-attachments/assets/8353119d-305c-4751-88d7-8ad95665fc74" />

## Usage

1. Sign up/Login
2. Access the dashboard
3. Create a post ( text, image, or both )
   
## Future Improvements

* Add AI integration
* Improve UI/UX
* Add notifications

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## Author

Sakshi Verma

GitHub: https://github.com/Sakshyyvv
LinkedIn: www.linkedin.com/in/sakshyyvv
