<div align="center">

# 🗳️ Voting App

A secure role-based Voting Application built with the MERN stack.

> 🚧 Currently Under Development

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-Planned-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-Planned-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 📖 About

Voting App is a role-based web application where authenticated users can securely cast their vote while administrators manage candidates (electors).

The primary goal of this project is to understand authentication, authorization, REST APIs, MongoDB relationships, and role-based access control (RBAC) using Node.js and Express.

This project is being developed while learning backend development and will gradually evolve into a complete MERN application.

---

## 🚀 Planned Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

### Frontend *(Planned)*

- React.js
- Tailwind CSS

### Tools

- Git & GitHub
- Postman
- VS Code

---

# 📂 Project Status

Current Progress

- ✅ Backend setup
- ✅ Express Server
- ✅ MongoDB Connection
- 🚧 Authentication
- 🚧 Role Based Authorization
- 🚧 Voting APIs
- 🚧 Candidate Management APIs
- ⏳ React Frontend
- ⏳ Deployment

---

# ✨ Planned Features

## 👤 Authentication

- User Registration
- User Login
- JWT Authentication
- Password Encryption
- Protected Routes

---

## 🙋 User Features

- View Profile
- Update Password
- Cast Vote
- Vote only once
- View Candidate List

---

## 👑 Admin Features

- Create Candidate
- Update Candidate
- Delete Candidate
- View Vote Count
- Manage Elections

---

# 🔐 Roles

### Voter

- Register
- Login
- View Profile
- Update Password
- Vote Once

### Admin

- Full Candidate Management
- Monitor Votes
- View Vote Counts
- Manage Election Data

---

# 📌 API Roadmap

Authentication

```
POST    /signup
POST    /login
GET     /profile
PUT     /profile/password
```

Voting

```
GET     /electors
POST    /vote/:electorId
GET     /vote/count
```

Admin

```
POST    /electors
PUT     /electors/:electorId
DELETE  /electors/:electorId
```

---

# 🔄 Planned Workflow

```
User
 │
 ├── Register
 ├── Login
 │
 ├── View Profile
 ├── Update Password
 │
 └── Vote
        │
        ├── View Candidates
        └── Cast Vote

Admin
 │
 ├── Create Candidate
 ├── Update Candidate
 ├── Delete Candidate
 └── View Vote Counts
```

---

# 📷 System Flow

> The following workflow represents the planned architecture of the application.

<p align="center">
<img src="./assets/workflow.png" width="700">
</p>

*(Replace the image path if required.)*

---

# 📁 Project Structure (Planned)

```
Voting-App/

│
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── frontend/
│
├── README.md
│
└── package.json
```

---

# 🎯 Learning Objectives

This project focuses on learning:

- Express.js
- REST APIs
- MongoDB & Mongoose
- JWT Authentication
- Password Hashing
- Middleware
- RBAC (Role Based Access Control)
- MERN Architecture
- Git & GitHub Workflow

---

# 💡 Future Improvements

- React Frontend
- Tailwind UI
- Dashboard
- Election Scheduling
- Real-time Vote Counting
- Email Verification
- Forgot Password
- Admin Analytics
- Charts & Graphs
- Docker Support
- CI/CD Pipeline
- Deployment

---

# 📚 References

This project is inspired by backend learning resources and is being built while exploring authentication, REST APIs, and MongoDB.

Learning References:

- https://www.youtube.com/watch?v=eQ-WJlMBHM4
- https://youtu.be/sRClNGeTpgs
- https://youtu.be/dEm3BR8Wkv4

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

# 👨‍💻 Author

**Gunaj Chugh**

GitHub: https://github.com/codedbygunnaj

---

# ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.

It motivates further development and open-source contributions.