import './Skeleton.css';

const Skeleton = ({ type }) => {
  if (type === 'table') {
    return (
      <div className="skeleton-wrapper">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-cell short"></div>
            <div className="skeleton-cell medium"></div>
            <div className="skeleton-cell medium"></div>
            <div className="skeleton-cell long"></div>
            <div className="skeleton-cell short"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="skeleton-card">
        <div className="skeleton-icon"></div>
        <div className="skeleton-text short"></div>
        <div className="skeleton-text long"></div>
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="skeleton-form">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-input"></div>
        ))}
      </div>
    );
  }

  return <div className="skeleton-default"></div>;
};

export default Skeleton;