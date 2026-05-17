import React from 'react';
import { Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface PlatformInfo {
  name: string;
  status: 'supported' | 'limited' | 'unsupported';
  description: string;
  requirements?: string[];
  limitations?: string[];
}

const VideoPlatformInfo: React.FC = () => {
  const platforms: PlatformInfo[] = [
    {
      name: 'YouTube',
      status: 'supported',
      description: 'Full support with thumbnails and embedding',
      requirements: ['Public video', 'Embedding enabled'],
      limitations: ['Some videos may have embedding disabled']
    },
    {
      name: 'Vimeo',
      status: 'supported',
      description: 'Full support with thumbnails and embedding',
      requirements: ['Public video', 'Embedding enabled'],
      limitations: ['Some videos may have embedding disabled']
    },
    {
      name: 'Facebook',
      status: 'limited',
      description: 'Requires Facebook app setup and authentication',
      requirements: ['Facebook App ID', 'User authentication', 'Proper permissions'],
      limitations: [
        'Cannot embed without Facebook app setup',
        'Requires user to be logged into Facebook',
        'Videos must be public and embeddable'
      ]
    },
    {
      name: 'Instagram',
      status: 'limited',
      description: 'Limited embedding support',
      requirements: ['Public post', 'Embedding enabled'],
      limitations: [
        'Only public posts can be embedded',
        'Requires Instagram app setup for full functionality'
      ]
    },
    {
      name: 'TikTok',
      status: 'limited',
      description: 'Limited embedding support',
      requirements: ['Public video', 'Embedding enabled'],
      limitations: ['May require TikTok app setup']
    },
    {
      name: 'Direct Video Files',
      status: 'supported',
      description: 'Full support for MP4, WebM, OGG files',
      requirements: ['Valid video file URL'],
      limitations: ['File must be accessible via URL']
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'supported':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'limited':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'unsupported':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'supported':
        return 'border-green-200 bg-green-50';
      case 'limited':
        return 'border-yellow-200 bg-yellow-50';
      case 'unsupported':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Video Platform Support</h2>
        <p className="text-gray-600">Information about supported video platforms and their limitations</p>
      </div>

      <div className="grid gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className={`border rounded-lg p-4 ${getStatusColor(platform.status)}`}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(platform.status)}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{platform.name}</h3>
                <p className="text-gray-700 mb-3">{platform.description}</p>
                
                {platform.requirements && (
                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Requirements:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {platform.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {platform.limitations && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Limitations:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {platform.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Facebook Video Setup</h3>
            <p className="text-blue-800 text-sm mb-3">
              To properly embed Facebook videos, you need to set up a Facebook app and configure proper permissions.
            </p>
            <div className="text-blue-800 text-sm space-y-1">
              <p><strong>Steps:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Create a Facebook App in Facebook Developers</li>
                <li>Configure video embedding permissions</li>
                <li>Add your domain to the app settings</li>
                <li>Use the app ID in your embed URLs</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlatformInfo; 