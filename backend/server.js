import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import articleRoutes from './routes/articles.js';
import authRoutes from './routes/auth.js';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true  // Allow all origins in production for single deployment
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Handle React routing - send all non-API requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Create admin user if it doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '123456';
    
    try {
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        const admin = new User({
          username: 'admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin'
        });
        await admin.save();
        console.log('Admin user created successfully');
        console.log(`Admin credentials - Email: ${adminEmail}, Password: ${adminPassword}`);
      } else {
        // Update existing admin if email matches - ensure role and password are correct
        if (existingAdmin.email === adminEmail) {
          existingAdmin.role = 'admin';
          existingAdmin.username = 'admin'; // Ensure username is admin
          // Only update password if it's different (to avoid unnecessary hashing)
          existingAdmin.password = adminPassword; // Will be hashed by pre-save hook
          await existingAdmin.save();
          console.log('Admin user updated successfully');
          console.log(`Admin credentials - Email: ${adminEmail}, Password: ${adminPassword}`);
        }
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export default app;


