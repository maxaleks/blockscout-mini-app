import React, { ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
