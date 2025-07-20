import React, { useState } from 'react';
import Avatar from '../Common/Avatar';

const AvatarDebug: React.FC = () => {
  const [testUrl, setTestUrl] = useState('');

  // Test URLs for different scenarios
  const testCases = [
    {
      name: 'Valid Image URL',
      src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      userName: 'John Doe'
    },
    {
      name: 'Google Profile Image',
      src: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      userName: 'Google User'
    },
    {
      name: 'Invalid URL',
      src: 'https://invalid-url.com/avatar.jpg',
      userName: 'Invalid User'
    },
    {
      name: 'No Image URL',
      src: undefined,
      userName: 'No Image User'
    },
    {
      name: 'Empty String URL',
      src: '',
      userName: 'Empty URL User'
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Avatar Component Debug</h2>
      
      {/* Test Cases */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-700">Test Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testCases.map((testCase, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{testCase.name}</h4>
              <div className="flex items-center space-x-3 mb-2">
                <Avatar
                  src={testCase.src}
                  name={testCase.userName}
                  size="lg"
                />
                <div>
                  <div className="text-sm font-medium">{testCase.userName}</div>
                  <div className="text-xs text-gray-500 break-all">
                    {testCase.src || 'No URL'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom URL Test */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Custom URL Test</h3>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="url"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="Enter image URL to test..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => setTestUrl('')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
        {testUrl && (
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Avatar
              src={testUrl}
              name="Test User"
              size="lg"
            />
            <div>
              <div className="text-sm font-medium">Test User</div>
              <div className="text-xs text-gray-500 break-all">{testUrl}</div>
            </div>
          </div>
        )}
      </div>

      {/* Size Variations */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Size Variations</h3>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              name="Small User"
              size="sm"
            />
            <div className="text-xs mt-1">Small</div>
          </div>
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              name="Medium User"
              size="md"
            />
            <div className="text-xs mt-1">Medium</div>
          </div>
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              name="Large User"
              size="lg"
            />
            <div className="text-xs mt-1">Large</div>
          </div>
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              name="XL User"
              size="xl"
            />
            <div className="text-xs mt-1">Extra Large</div>
          </div>
        </div>
      </div>

      {/* Fallback Cases */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Fallback Cases</h3>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <Avatar name="John Doe" size="lg" />
            <div className="text-xs mt-1">Initials</div>
          </div>
          <div className="text-center">
            <Avatar name="A" size="lg" />
            <div className="text-xs mt-1">Single Letter</div>
          </div>
          <div className="text-center">
            <Avatar name="" size="lg" />
            <div className="text-xs mt-1">No Name</div>
          </div>
          <div className="text-center">
            <Avatar size="lg" />
            <div className="text-xs mt-1">No Props</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDebug;
