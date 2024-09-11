# Talk Thread 

## Overview

**Talk Thread**  is a community-driven blog platform where users can not only explore various blogs but also contribute their own and interact with others through comments, likes, and dislikes.
![Homepage Screenshot](./frontend/src/assets/Banner.png)
## Features

- **User Authentication**: Secure login and registration system.
- **Blog Collection**: View and explore a collection of blogs from various users.
- **Create, Edit, and Delete Blogs**: Users can write new blogs, update their content, or remove them.
- **Comment System**: Users can leave comments on blogs and edit or delete their own comments.
- **Like & Dislike**: Engage with blogs by liking or disliking them.
- **Blog Images**: Add and update images in blogs.
## Tech Stack

- **Frontend**: React.js, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Styling**: Tailwind Css
- **Deployment**: Vercel (for frontend) , Render (for backend)

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AsifAvaas/TalkThreads.git
   cd TalkThreads
   ```
2. **Install dependencies:**

   ```bash
   cd .\backend\
   npm install bcrypt cors express express-validator  jsonwebtoken mongoose cloudinary  nodemon dotenv multer nodemailer

   cd .\frontend\
   npm install react-router-dom axios jwt-decode tailwind

   ```

3. **Run the app:**

   ```bash
   cd .\backend\
   nodemon index.js

   cd .\frontend\
   npm run dev
   ```
   The application should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

- **Users**: Create an account, log in, browse blogs, create, edit, delete blogs, and interact with other users' blogs via likes, dislikes, and comments.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

- **Asif A Khuda**: [asif13.aak@gmail.com](mailto:asif13.aak@gmail.com)
- **GitHub**: [[https://github.com/AsifAvaas](https://github.com/AsifAvaas)](https://github.com/AsifAvaas)
