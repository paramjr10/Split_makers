// PageWrapper.jsx
import React from 'react';
import Header from './Header';

function PageWrapper({ children }) {
 return (
    <div>
      <Header />
      {children}
    </div>
 );
}

export default PageWrapper;
