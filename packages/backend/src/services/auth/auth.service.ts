import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../../db';

interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

export class AuthService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, 'user')
      RETURNING id, email, role;
    `;

    const result = await pool.query(query, [email, hashedPassword]);
    return result.rows[0];
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const query = `
      SELECT id, email, password_hash, role
      FROM users
      WHERE email = $1;
    `;

    const result = await pool.query(query, [email]);
    const user = result.rows[0];

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

  generateToken(user: User): string {
    return jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch {
      return null;
    }
  }
}
