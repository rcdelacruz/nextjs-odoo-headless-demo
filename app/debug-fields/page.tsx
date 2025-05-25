'use client';

import { useState } from 'react';

export default function DebugFieldsPage() {
  const [fields, setFields] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkFields = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/odoo/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'res.partner',
          method: 'fields_get',
        }),
      });

      const result = await response.json();
      setFields(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Debug: res.partner Fields</h1>
      
      <button
        onClick={checkFields}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-6"
      >
        {loading ? 'Loading...' : 'Check Available Fields'}
      </button>

      {fields && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Available Fields:</h2>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {Object.keys(fields).sort().map(field => (
              <div key={field} className="bg-white p-2 rounded">
                <strong>{field}</strong>
                <br />
                <span className="text-gray-600">{fields[field].type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
