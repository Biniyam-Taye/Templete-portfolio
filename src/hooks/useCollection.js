import { useState, useEffect } from 'react';
import { dummyData } from '../data/dummyData';

export const useCollection = (collectionName, sortField = 'createdAt') => {
  // Initialize with data immediately to avoid empty state
  const [data, setData] = useState(() => {
    try {
      const result = dummyData[collectionName] || [];
      console.log(`[useCollection] Initializing ${collectionName}:`, result);
      return result;
    } catch (err) {
      console.error(`[useCollection] Error initializing ${collectionName}:`, err);
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate network delay for realism (optional, can be 0)
    const timer = setTimeout(() => {
      try {
        const result = dummyData[collectionName] || [];
        console.log(`[useCollection] Loading ${collectionName}:`, result);
        console.log(`[useCollection] Available collections:`, Object.keys(dummyData));
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error(`Error loading dummy data for ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [collectionName]);

  return { data, loading, error };
};
