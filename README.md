# LinkedIn Clone - Full Stack Social Media Application

A simplified LinkedIn clone built with HTML, CSS, JavaScript for the frontend and Node.js, Express, MongoDB for the backend.

## 🚀 Live Demo

- **Frontend:** https://eloquent-stroopwafel-d7997e.netlify.app/
- **Backend API:** https://linkedin-clone-backenddd.onrender.com/

## 📸 Screenshots

![Login Page](screenshots/loginpage.png)
![Feed Page](screenshots/Feed.png)

## ✨ Features

### Core Features
- ✅ User Authentication (Signup/Login with JWT)
- ✅ Create, Read, Update, Delete Posts
- ✅ Like/Unlike Posts
- ✅ Real-time Post Feed
- ✅ User Profile Display
- ✅ Secure Password Hashing (bcrypt)

### Bonus Features
- ✅ Edit Posts (inline editing)
- ✅ Delete Posts (with confirmation)
- ✅ Responsive Design (mobile-friendly)
- ✅ Auto-login (localStorage)
- ✅ Time formatting ("5m ago", "2h ago")

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (with Flexbox & Grid)
- **Vanilla JavaScript** - Functionality & API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure
```
linkedin-clone/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Post.js          # Post schema
│   ├── routes/
│   │   ├── auth.js          # Auth endpoints (login/signup)
│   │   └── posts.js         # Post CRUD endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── server.js            # Express server setup
│   ├── .env                 # Environment variables
│   └── package.json
│
└── frontend-html/
    ├── index.html           # Main HTML file
    ├── css/
    │   └── style.css        # All styles
    └── js/
        └── app.js           # Frontend logic & API calls
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/linkedin-clone.git
cd linkedin-clone
```

### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
# Add these variables:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
# Navigate to frontend folder
cd frontend-html

# Update API URL in js/app.js
# Change API_URL to your backend URL (http://localhost:5000 for local)

# Open index.html in browser
# OR use Live Server extension in VS Code
# OR run: python -m http.server 3000
```

The frontend will run on `http://localhost:3000` (or your chosen port)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)
- `POST /api/posts/:id/like` - Like/Unlike post (auth required)

## 🔐 Environment Variables

Create a `.env` file in the backend folder:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkedin-clone
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
```

## 📝 How to Use

1. **Signup:** Create a new account with name, email, and password
2. **Login:** Sign in with your credentials
3. **Create Post:** Write something in the text box and click "Post"
4. **Like Posts:** Click the heart icon to like/unlike
5. **Edit Post:** Click the edit icon (✏️) on your own posts
6. **Delete Post:** Click the delete icon (🗑️) on your own posts
7. **Logout:** Click the logout button to sign out

## 🚀 Deployment

### Backend (Render/Railway)

1. Create account on [Render](https://render.com) or [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables in dashboard
4. Deploy!

### Frontend (Netlify)

1. Create account on [Netlify](https://netlify.com)
2. Drag & drop the `frontend-html` folder
3. Update `API_URL` in `js/app.js` to deployed backend URL
4. Deploy!

## 🐛 Known Issues

- Comment functionality is placeholder (not implemented)
- No image upload support yet
- No user profile pages yet

## 🔮 Future Enhancements

- [ ] Comment system
- [ ] User profiles with bio and avatar
- [ ] Follow/unfollow users
- [ ] Private messaging
- [ ] Image uploads for posts
- [ ] Search functionality
- [ ] Notifications
- [ ] Dark mode

## 👨‍💻 Author

**Garv Verma**
- GitHub: [@garvverma](https://github.com/garvverma)
- Email: garvverma93@gmail.com

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by LinkedIn
- Built as part of AppDost internship assignment
- MongoDB Atlas for database hosting
- Render/Railway for backend hosting
- Netlify for frontend hosting

---

⭐ If you found this project helpful, please give it a star!
