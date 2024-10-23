import React, { useState, useEffect } from 'react';

const Tabs = ({ children, defaultActiveTab }) => {
  const initialTab = defaultActiveTab || children[0].props.label;
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    // İlk tabı default olaraq aktiv edin
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <div className="w-full mx-auto product-detail-tabs-wrapper">
      <div className="flex justify-center product-detail-tabs-btn-wrap items-center gap-8 py-4">
        {children.map(child => (
          <button
            key={child.props.label}
            className={`${
              activeTab === child.props.label
                ? 'border-b-2 border-red-500 text-red-600' // Aktiv tabın stili
                : 'text-gray-500 hover:text-gray-700' // Passiv tabın stili
            } text-gray-700 font-semibold py-2`}
            onClick={e => handleClick(e, child.props.label)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="py-8 px-4 product-detail-tabs-wrap pd-review-border">
        {children.map(child => {
          if (child.props.label === activeTab) {
            return <div key={child.props.label}>{child.props.children}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
};

const Tab = ({ label, children }) => {
  return (
    <div label={label} className="hidden">
      {children}
    </div>
  );
};

export { Tabs, Tab };
