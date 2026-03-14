import axios from 'axios';

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'student@quranacademy.com',
      password: 'Student@123'
    });
    console.log('Login Success:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Login Failed Status:', err.response?.status);
    console.error('Login Failed Data:', JSON.stringify(err.response?.data, null, 2));
  }
}

testLogin();
