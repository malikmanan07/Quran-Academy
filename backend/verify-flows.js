const API_URL = 'http://localhost:5000/api';

async function run() {
  console.log('🚀 Starting Flow Verification...\n');

  try {
    // Flow 1: Admin Login
    console.log('--- Flow 1: Admin Login ---');
    const adminRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@quranacademy.com', password: 'Admin@123' })
    });
    const adminData = await adminRes.json();
    if (!adminRes.ok) throw new Error(`Admin Login Failed: ${adminData.message}`);
    console.log('✅ Admin Login Success');
    const adminToken = adminData.data.token;
    console.log('Admin Status:', adminData.data.user.status);

    // Flow 2: Student Signup
    console.log('\n--- Flow 2: Student Signup ---');
    const studentEmail = `student_${Date.now()}@test.com`;
    const signupRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: studentEmail,
        password: 'Password@123',
        role: 'student'
      })
    });
    const signupData = await signupRes.json();
    if (!signupRes.ok) throw new Error(`Signup Failed: ${signupData.message}`);
    console.log('✅ Signup Success');
    
    // Try login with pending student
    console.log('Trying login with pending student...');
    const pendingLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentEmail, password: 'Password@123' })
    });
    const pendingLoginData = await pendingLoginRes.json();
    if (pendingLoginRes.status === 403) {
      console.log('✅ Login Blocked (Expected):', pendingLoginData.message);
    } else {
      console.log('❌ Unexpected login response:', pendingLoginRes.status);
    }

    // Flow 3: Admin Approve
    console.log('\n--- Flow 3: Admin Approval ---');
    const pendingRes = await fetch(`${API_URL}/admin/pending-users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const pendingData = await pendingRes.json();
    const newUser = pendingData.data.users.find(u => u.email === studentEmail);
    if (!newUser) throw new Error('New student not found in pending list');
    
    const approveRes = await fetch(`${API_URL}/admin/users/${newUser.id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!approveRes.ok) throw new Error('Approval Failed');
    console.log('✅ Student Approved');

    // Flow 4: Student Login Success
    console.log('\n--- Flow 4: Student Login (After Approval) ---');
    const studentLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentEmail, password: 'Password@123' })
    });
    const studentLoginData = await studentLoginRes.json();
    if (!studentLoginRes.ok) throw new Error(`Student Login Failed: ${studentLoginData.message}`);
    console.log('✅ Student Login Success');
    console.log('Student Status:', studentLoginData.data.user.status);

    // Flow 5: Teacher Login
    console.log('\n--- Flow 5: Teacher Login ---');
    const teacherLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'teacher@quranacademy.com', password: 'Teacher@123' })
    });
    const teacherLoginData = await teacherLoginRes.json();
    if (!teacherLoginRes.ok) throw new Error(`Teacher Login Failed: ${teacherLoginData.message}`);
    console.log('✅ Teacher Login Success');
    console.log('Teacher Status:', teacherLoginData.data.user.status);

    console.log('\n🎉 ALL LOGIC FLOWS VERIFIED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ Flow Verification Failed:', err.message);
    process.exit(1);
  }
}

run();
