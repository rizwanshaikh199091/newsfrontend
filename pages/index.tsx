import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { login } from '../src/redux/authSlice';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email, password }));
    console.log("resultAction", resultAction);
    if (login.fulfilled.match(resultAction)) {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>Login</button>
        {error && <p className="error">{error}</p>}
        <p>Don't have an account? <Link href="/register">Register</Link></p>
      </form>
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
        }
        form {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }
        h1 {
          margin-bottom: 1.5rem;
          color: #333;
        }
        input {
          display: block;
          width: 100%;
          margin-bottom: 1rem;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          transition: border-color 0.3s;
        }
        input:focus {
          border-color: #0070f3;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          background: #0070f3;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
        }
        button:hover {
          background: #005bb5;
          transform: translateY(-2px);
        }
        button:active {
          background: #003f8a;
          transform: translateY(0);
        }
        .error {
          color: red;
          margin-top: 1rem;
        }
        p {
          margin-top: 1rem;
        }
        a {
          color: #0070f3;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;
