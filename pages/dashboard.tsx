import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { logout, setUser } from '../src/redux/authSlice';
import Header from './Header';
import Loader from './Loader';  // Assume Loader is a spinner component
import config from '@/src/config';
const categories = ['Select', 'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
const sources = ['Select', 'News API', 'The Guardian', 'New York Times'];

export interface IArticle {
    title: string;
    description: string;
    url: string;   
    source: string;
    date: Date;
}

const Dashboard = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);
  const [preferredSources, setPreferredSources] = useState<string[]>([]);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAppSelector((state) => state.auth);
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight) {
        if (!isFetching && hasMore) {
          fetchMoreNews();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articles, total, isFetching, hasMore]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${config.webServerUrl}/api/profile`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setPreferredCategories(response.data.preferredCategories);
      setPreferredSources(response.data.preferredSources);
      fetchNews(response.data.preferredCategories, response.data.preferredSources);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchNews = async (categories = preferredCategories, sources = preferredSources) => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${config.webServerUrl}/api/news`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        params: {
          query,
          startDate,
          endDate,
          categories,
          sources,
          limit,
          offset: 0,
        },
      });
      setArticles(response.data.articles);
      setTotal(response.data.total);
      setOffset(limit);
      setHasMore(response.data.articles.length === limit);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
    setIsFetching(false);
  };

  const fetchMoreNews = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${config.webServerUrl}/api/news`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        params: {
          query,
          startDate,
          endDate,
          categories: preferredCategories,
          sources: preferredSources,
          limit,
          offset,
        },
      });
      setArticles(prev => [...prev, ...response.data.articles]);
      setOffset(prev => prev + limit);
      setHasMore(response.data.articles.length === limit);
    } catch (error) {
      console.error("Error fetching more news:", error);
    }
    setIsFetching(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <Header />
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          placeholder="Search news" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
        <input 
          type="date" 
          placeholder="Start date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
        />
        <input 
          type="date" 
          placeholder="End date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
        />
        <select value={preferredCategories.join(',')} onChange={(e) => {
          const options = e.target.options;
          const selectedCategories = [];
          for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
              selectedCategories.push(options[i].value);
            }
          }
          setPreferredCategories(selectedCategories);
        }}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select value={preferredSources.join(',')} onChange={(e) => {
          const options = e.target.options;
          const selectedSources = [];
          for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
              selectedSources.push(options[i].value);
            }
          }
          setPreferredSources(selectedSources);
        }}>
          {sources.map((src) => (
            <option key={src} value={src}>{src}</option>
          ))}
        </select>
        <button type="submit">Search</button>
      </form>
      <div className="articles">
        {articles.map((article:IArticle, index) => (
          <div key={index} className="article">
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <p><strong>Source:</strong> {article.source}</p>
            <p><strong>Date:</strong> {new Date(article.date).toLocaleDateString()}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        ))}
      </div>
      {isFetching && <Loader />}
      {!hasMore && !isFetching && <p className="no-more-content">No more content available</p>}
      <style jsx>{`
        .dashboard-container {
          padding: 2rem;
          background-color: #f0f2f5;
          font-family: 'Roboto', sans-serif;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #fff;
          padding: 1rem 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
        .search-form {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          background-color: #fff;
          padding: 1.5rem 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .search-form input, .search-form select {
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          flex: 1;
          min-width: 200px;
        }
        .search-form button {
          padding: 0.75rem 1.5rem;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .search-form button:hover {
          background-color: #005bb5;
        }
        .articles {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        .article {
          background: #fff;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .article:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        .article h2 {
          margin: 0 0 1rem;
          color: #333;
          font-size: 1.5rem;
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
        .no-more-content {
          text-align: center;
          margin-top: 2rem;
          font-size: 1.2rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
