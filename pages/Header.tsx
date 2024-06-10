import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { logout, setUser } from '../src/redux/authSlice';

interface Props {}

const Header = ({}: Props) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <header className="header">
      <h1>News Dashboard</h1>
      {user && (
        <nav className="nav">
          <Link href="/dashboard" className="nav-link">
            Home
          </Link>
          <Link href="/profile" className="nav-link">
            Profile
          </Link>
          <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
        </nav>
      )}
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #fff;
          padding: 1rem 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .header h1 {
          margin: 0;
          color: #333;
        }
        .nav {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .nav-link {
          color: #0070f3;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        .nav-link:hover {
          background-color: #e0e0e0;
        }
        .logout-button {
          background-color: #0070f3;
          color: #fff;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .logout-button:hover {
          background-color: #005bb5;
        }
        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          .nav {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            margin-top: 1rem;
          }
          .nav-link, .logout-button {
            width: 100%;
            text-align: center;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
