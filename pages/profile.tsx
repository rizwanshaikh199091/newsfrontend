import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { logout, setUser } from '../src/redux/authSlice';
import Header from './Header';
import config from '@/src/config';
const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
const sources = ['News API', 'The Guardian', 'OpenNews'];
export interface IArticle {
    title: string;
    description: string;
    url: string;   
    source: string;
    date: Date;
}
const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);
  const [preferredSources, setPreferredSources] = useState<string[]>([]);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setUser({ token }));
    } else {
      router.push('/');
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${config.webServerUrl}/api/profile`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setPreferredCategories(response.data.preferredCategories);
      setPreferredSources(response.data.preferredSources);
      setArticles(response.data.articles);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleCategoryChange = (category: string) => {
    setPreferredCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSourceChange = (source: string) => {
    setPreferredSources(prev => {
      if (prev.includes(source)) {
        return prev.filter(src => src !== source);
      } else {
        return [...prev, source];
      }
    });
  };

  const handleSaveSettings = async () => {
    try {
      await axios.put(`${config.webServerUrl}/api/profile`, {
        preferredCategories,
        preferredSources,
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert('Failed to save settings.');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <Header />
      <div className="settings">
        <h2>Preferred Categories</h2>
        <div className="options">
          {categories.map((category) => (
            <label key={category} className="option">
              <input
                type="checkbox"
                checked={preferredCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
        <h2>Preferred Sources</h2>
        <div className="options">
          {sources.map((source) => (
            <label key={source} className="option">
              <input
                type="checkbox"
                checked={preferredSources.includes(source)}
                onChange={() => handleSourceChange(source)}
              />
              {source}
            </label>
          ))}
        </div>
        <button onClick={handleSaveSettings}>Save Settings</button>
      </div>
      <div className="articles">
        <h2>Saved Articles</h2>
        { (articles && articles.length > 0 && articles!=null && typeof articles!=undefined) ? (
          articles.map((article:IArticle, index) => (
            <div key={index} className="article">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <p><strong>Source:</strong> {article.source}</p>
              <p><strong>Date:</strong> {new Date(article.date).toLocaleDateString()}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
            </div>
          ))
        ) : (
          <p>No saved articles.</p>
        )}
      </div>
      <style jsx>{`
        .profile-container {
          padding: 2rem;
          background-color: #f9f9f9;
          font-family: 'Arial', sans-serif;
        }
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
        .header button {
          padding: 0.5rem 1rem;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .header button:hover {
          background-color: #005bb5;
        }
        .settings {
          background-color: #fff;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .settings h2 {
          margin-top: 0;
          color: #333;
        }
        .options {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .option {
          display: flex;
          align-items: center;
        }
        .option input {
          margin-right: 0.5rem;
        }
        .articles {
          background-color: #fff;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .articles h2 {
          margin-top: 0;
          color: #333;
        }
        .article {
          background: #fff;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 1rem;
        }
        .article:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
        }
        .article h3 {
          margin: 0 0 1rem;
          color: #333;
        }
        .article p {
          margin: 0 0 1rem;
          color: #666;
        }
        .article a {
          color: #0070f3;
          text-decoration: none;
        }
        .article a:hover {
          text-decoration: underline;
        }
        .settings button {
          padding: 0.75rem 1.5rem;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 1rem;
        }
        .settings button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default Profile;
