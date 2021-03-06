import './styles.css';

export const Loading: React.FC = () => {
  return (
    <div className="loader-wrap" role="progressbar">
      <div className="loader">Loading...</div>
    </div>
  );
};
