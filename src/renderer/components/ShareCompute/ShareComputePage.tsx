import React, { useState } from 'react';

interface Model {
  id: string;
  name: string;
  description: string;
  size: number;
}

interface ShareComputePageProps {
  onStartSharing: () => void;
  onCancel: () => void;
}

const ShareComputePage: React.FC<ShareComputePageProps> = ({
  onStartSharing,
  onCancel,
}) => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const models: Model[] = [
    {
      id: 'model-1',
      name: 'llava:latest',
      description: 'Vision language model',
      size: 4.7,
    },
    {
      id: 'model-2',
      name: 'mistral:7b',
      description: 'Large language model',
      size: 3.8,
    },
    {
      id: 'model-3',
      name: 'codellama:13b',
      description: 'Code generation model',
      size: 7.3,
    },
    {
      id: 'model-4',
      name: 'phi:latest',
      description: 'Efficient language model',
      size: 1.6,
    },
    {
      id: 'model-5',
      name: 'gemma:7b',
      description: 'Instruction-tuned model',
      size: 4.1,
    },
  ];

  const handleModelToggle = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleStartSharing = () => {
    if (selectedModels.length > 0) {
      onStartSharing();
    }
  };

  const selectedCount = selectedModels.length;
  const totalSize = selectedModels.reduce(
    (sum, modelId) => sum + models.find((m) => m.id === modelId)!.size,
    0
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Share My Compute</h1>
          <p className="text-gray-600">
            Select models to share with the network. Models will be downloaded in the background.
          </p>
        </div>

        {/* Model Selection Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-secondary">Available Models</h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose which models you want to share with the network
            </p>
          </div>

          {/* Model List */}
          <div className="p-6">
            <div className="space-y-4">
              {models.map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between p-4 bg-light-gray rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id={model.id}
                      checked={selectedModels.includes(model.id)}
                      onChange={() => handleModelToggle(model.id)}
                      className="w-5 h-5 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <div>
                      <h3 className="font-medium text-secondary">{model.name}</h3>
                      <p className="text-sm text-gray-600">{model.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-secondary">{model.size}GB</span>
                    <p className="text-sm text-gray-500">File size</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="px-6 py-4 bg-blue-50 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <i className="fa-solid fa-info-circle text-primary text-lg mt-0.5"></i>
              <div>
                <h4 className="font-medium text-secondary mb-1">Background Download Notice</h4>
                <p className="text-sm text-gray-600">
                  Selected models will be downloaded in the background and may take some time
                  depending on your internet connection. You can continue using the application
                  while downloads are in progress.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Total selected:</span>
              <span className="text-sm font-medium text-secondary">
                {selectedCount} model{selectedCount !== 1 ? 's' : ''}
              </span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm font-medium text-secondary">{totalSize.toFixed(1)} GB</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartSharing}
                disabled={selectedCount === 0}
                className="px-6 py-2 bg-accent hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-share mr-2"></i>
                Start Sharing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareComputePage;
