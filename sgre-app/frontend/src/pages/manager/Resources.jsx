import React, { useEffect, useState } from 'react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/v1/resources');
        const data = await response.json();
        setResources(data.resources);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Resources</h1>
      <ul>
        {resources.map(resource => (
          <li key={resource.id} className="border-b py-2">
            {resource.name} - {resource.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Resources;