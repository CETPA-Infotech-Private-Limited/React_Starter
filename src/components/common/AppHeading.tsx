import React from 'react';

type AppHeadingProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

const AppHeading: React.FC<AppHeadingProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        {/* {icon && <div className="text-4xl text-primary">{icon}</div>} */}
        <h1 className="text-3xl font-bold text-primary">{title}</h1>
      </div>
      {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
    </div>
  );
};

export default AppHeading;
