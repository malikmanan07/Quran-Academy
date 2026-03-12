import db from '../config/db.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists ❌' });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await db.insert(users).values({
      name, email, password: hash, role, phone
    }).returning();

    res.status(201).json({ 
      success: true, 
      message: 'User created ✅', 
      user: newUser[0] 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.select().from(users).where(eq(users.email, email));
    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found ❌' });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Wrong password ❌' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Me
export const getMe = async (req, res) => {
  try {
    const result = await db.select().from(users).where(eq(users.id, req.user.id));
    res.json({ success: true, user: result[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};