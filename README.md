# 🔥 Firebase Authentication with Role-Based Access Control

A full-stack MERN application demonstrating Firebase Authentication with role-based authorization and CRUD operations for tasks management.

## ✨ Features

- ** Firebase Authentication**: Google Sign-in with secure token-based authentication
- ** Role-Based Access Control**: Admin and User roles with different permissions
- ** Task Management**: Full CRUD operations for tasks
- ** Secure APIs**: Protected endpoints with role-based authorization
- ** Modern UI**: Clean, responsive React frontend with beautiful design
- ** Real-time Updates**: Immediate UI updates after operations
- ** Admin Dashboard**: Role assignment and system management tools

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Firebase project
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/piyusu/firebase-authentication-.git
cd firebase-authentication
```

### 2. Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project or use existing
   - Enable Authentication → Google sign-in

2. **Get Web App Configuration**:
   - Project Settings → General → Your apps → Web app
   - Copy: `apiKey`, `authDomain`, `projectId`

3. **Get Service Account**:
   - Project Settings → Service Accounts → Generate new private key
   - Download JSON file

### 3. Environment Configuration

#### Client Environment (`.env`)
```bash
# Create client/.env
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_API_BASE_URL=http://localhost:4000/api
```

#### Server Environment (`.env`)
```bash
# Create server/.env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/firebase_authentication
# OR for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/firebase_authentication
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Important**: Keep the quotes around `FIREBASE_PRIVATE_KEY` and escape newlines as `\n`.

### 4. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 5. Run the Application

#### Terminal 1 - Server
```bash
cd server
npm run dev
# Server runs at http://localhost:4000
```

#### Terminal 2 - Client
```bash
cd client
npm run dev
# Client runs at http://localhost:5173
```

## 🔐 First Admin Setup

To access admin features, you need to set up the first admin user:

### Option 1: Using the Admin Script (Recommended)

1. **Find your Firebase UID**:
   - Sign in to your app
   - Open browser console (F12)
   - Type: `firebase.auth().currentUser?.uid`

2. **Update the script**:
   - Edit `server/set-admin.js`
   - Replace `YOUR_FIREBASE_UID` with your actual UID

3. **Run the script**:
   ```bash
   cd server
   node set-admin.js
   ```

### Option 2: Firebase Console

1. Go to Firebase Console → Authentication → Users
2. Find your user and click "Edit"
3. Add custom claims: `{"role":"admin"}`
4. Save changes

## 📚 API Documentation

### Authentication
All API calls require a valid Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

### Endpoints

#### Tasks API
- `POST /api/tasks` - Create new task (admin, user)
- `GET /api/tasks` - Get tasks (admin: all, user: own)
- `PUT /api/tasks/:id` - Update task (admin: any, user: own)
- `DELETE /api/tasks/:id` - Delete task (admin only)

#### Users API
- `GET /api/users/me` - Get current user profile
- `POST /api/users/assign-role` - Assign role (admin only)

### Role Permissions

| Action | Admin | User |
|--------|-------|------|
| Create Task | ✅ | ✅ |
| Read Own Tasks | ✅ | ✅ |
| Read All Tasks | ✅ | ❌ |
| Update Own Tasks | ✅ | ✅ |
| Update Any Task | ✅ | ❌ |
| Delete Tasks | ✅ | ❌ |
| Assign Roles | ✅ | ❌ |

## 🎨 Frontend Features

### User Interface
- **Modern Design**: Clean, professional appearance with gradients and shadows
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Interactive Elements**: Hover effects, smooth transitions, and loading states
- **Role-Based UI**: Different interfaces for admin and regular users

### Components
- **Authentication**: Google sign-in with profile management
- **Task Management**: Create, read, update, and delete tasks
- **Admin Controls**: Role assignment and system management
- **Real-time Updates**: Immediate UI feedback after operations

## 🔧 Backend Architecture

### Middleware
- **Authentication**: Firebase ID token verification
- **Authorization**: Role-based access control
- **Error Handling**: Comprehensive error responses

### Database Models
- **User**: Firebase UID, email, role, timestamps
- **Task**: Title, description, owner, completion status, timestamps

### Security Features
- **Token Validation**: Secure Firebase token verification
- **Role Enforcement**: Strict permission checking
- **Data Isolation**: Users can only access their own data (unless admin)

## 🚨 Security Considerations

- **Environment Variables**: Never commit `.env` files
- **Firebase Keys**: Keep service account JSON secure
- **Token Validation**: All API calls require valid Firebase tokens
- **Role Verification**: Server-side role checking for all protected endpoints

## 🐛 Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check your API key in `client/.env`

2. **"Invalid private key"**
   - Ensure private key has escaped newlines (`\n`)
   - Verify service account credentials

3. **"Role not updating"**
   - Sign out and back in after role changes
   - Wait a few minutes for Firebase propagation

4. **"MongoDB connection failed"**
   - Check MongoDB service is running
   - Verify connection string in `server/.env`

### Debug Mode

Enable detailed logging by setting environment variables:
```bash
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for authentication services
- MongoDB for database
- Express.js for backend framework
- React for frontend framework
- Vite for build tooling

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review Firebase and MongoDB documentation
3. Open an issue on GitHub
4. Check the code comments for implementation details

---

**Happy Coding! 🚀**

*This project demonstrates modern web development practices with secure authentication, role-based access control, and a beautiful user interface.*
