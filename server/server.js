require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL || '*' } });
app.set('io', io);

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

io.on('connection', (socket) => {
  socket.on('joinProject', (projectId) => { socket.join(projectId); });
  socket.on('leaveProject', (projectId) => { socket.leave(projectId); });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agileboard';

(async function start(){
  try {
    await connectDB(MONGO_URI);
    server.listen(PORT, ()=> console.log('Server listening on', PORT));
  } catch (err) {
    console.error('Startup error', err);
    process.exit(1);
  }
})();

module.exports = app;
