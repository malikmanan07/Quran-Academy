import jwt from 'jsonwebtoken';
const secret = 'quran_academy_super_secret_jwt_key_2025';
try {
  const token = jwt.sign({ id: 1, role: 'student' }, secret, { expiresIn: '7d' });
  console.log('Token created:', token);
} catch (err) {
  console.error('Token Error:', err);
}
