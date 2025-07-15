import { useEffect } from 'react';

export const useSupressSwaggerWarnings = () => {
  useEffect(() => {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Override console methods to filter swagger warnings
    console.error = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        (message.includes('UNSAFE_componentWillReceiveProps') ||
         message.includes('componentWillReceiveProps') ||
         message.includes('ModelCollapse') ||
         message.includes('OperationContainer'))
      ) {
        return; // Suppress these warnings
      }
      originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        (message.includes('UNSAFE_componentWillReceiveProps') ||
         message.includes('componentWillReceiveProps') ||
         message.includes('ModelCollapse') ||
         message.includes('OperationContainer'))
      ) {
        return; // Suppress these warnings
      }
      originalWarn.apply(console, args);
    };
    
    // Cleanup function to restore original methods
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);
};
