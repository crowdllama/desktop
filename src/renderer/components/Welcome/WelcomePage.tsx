import React from 'react';

interface WelcomePageProps {
  onShareCompute: () => void;
  onUseNetwork: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({
  onShareCompute,
  onUseNetwork,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <i className="fa-solid fa-network-wired text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">Welcome to CrowdLlama</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Share Compute Card */}
          <div className="group cursor-pointer" onClick={onShareCompute}>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 hover:border-green-400 transition-all duration-300 hover:shadow-lg">
              <div className="mb-6">
                <img
                  className="w-full h-48 rounded-xl object-cover"
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c8b356c92c-2383bb840124bce1121d.png"
                  alt="modern server room with glowing green lights, futuristic data center, digital illustration"
                />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fa-solid fa-server text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">Share My Compute</h3>
                <p className="text-neutral-600 mb-6">
                  Contribute your computational resources to the CrowdLlama network and earn rewards while helping others access powerful AI capabilities.
                </p>
                <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto">
                  <i className="fa-solid fa-share"></i>
                  <span>Get Started</span>
                </button>
              </div>
            </div>
          </div>

          {/* Use Network Card */}
          <div className="group cursor-pointer" onClick={onUseNetwork}>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
              <div className="mb-6">
                <img
                  className="w-full h-48 rounded-xl object-cover"
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/6e3aa3ee6b-cdd987807862135defed.png"
                  alt="network of connected computers and AI nodes, purple and blue gradient, futuristic digital network visualization"
                />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fa-solid fa-bolt text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">Use CrowdLlama Network</h3>
                <p className="text-neutral-600 mb-6">
                  Access distributed computing power from the CrowdLlama community for your AI workloads, machine learning tasks, and computational needs.
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto">
                  <i className="fa-solid fa-rocket"></i>
                  <span>Start Computing</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-shield-halved text-purple-600 text-xl"></i>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Secure &amp; Reliable</h4>
              <p className="text-sm text-neutral-600">Advanced encryption and secure protocols ensure your data and computations remain protected.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-gauge-high text-purple-600 text-xl"></i>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">High Performance</h4>
              <p className="text-sm text-neutral-600">Leverage distributed computing power for faster processing and better performance.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-coins text-purple-600 text-xl"></i>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Earn Rewards</h4>
              <p className="text-sm text-neutral-600">Get compensated for sharing your computational resources with the community.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
