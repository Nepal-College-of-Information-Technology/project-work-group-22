'use client';

import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

// Disable static generation for this component
export const dynamic = 'force-dynamic';

const SwaggerUIWrapper = ({ spec }) => {
  useEffect(() => {
    // Suppress React strict mode warnings for swagger-ui-react
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      if (
        args[0] &&
        typeof args[0] === 'string' &&
        (args[0].includes('UNSAFE_componentWillReceiveProps') ||
         args[0].includes('componentWillReceiveProps'))
      ) {
        return;
      }
      originalError(...args);
    };
    
    console.warn = (...args) => {
      if (
        args[0] &&
        typeof args[0] === 'string' &&
        (args[0].includes('UNSAFE_componentWillReceiveProps') ||
         args[0].includes('componentWillReceiveProps'))
      ) {
        return;
      }
      originalWarn(...args);
    };
    
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return (
    <SwaggerUI
      spec={spec}
      docExpansion="none"
      defaultModelsExpandDepth={1}
      defaultModelExpandDepth={1}
      displayRequestDuration={true}
      filter={true}
      showExtensions={true}
      showCommonExtensions={true}
      tryItOutEnabled={true}
    />
  );
};

export default SwaggerUIWrapper;
