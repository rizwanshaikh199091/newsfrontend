const Loader = () => (
    <div className="loader">
      <div className="spinner"></div>
      <style jsx>{`
        .loader {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2rem;
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #0070f3;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
  
  export default Loader;
  