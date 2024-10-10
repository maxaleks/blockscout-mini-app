import React from 'react';
import PageContainer from './PageContainer';

const LoadingPage: React.FC = () => {
  return (
    <PageContainer loading={true}>
      {/* This children prop is required but won't be rendered due to loading={true} */}
      <div></div>
    </PageContainer>
  );
};

export default LoadingPage;
