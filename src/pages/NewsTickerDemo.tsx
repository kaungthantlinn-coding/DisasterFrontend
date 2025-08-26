import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ScrollingNewsTicker from '../components/Common/ScrollingNewsTicker';
import DisasterNewsTicker from '../components/Common/DisasterNewsTicker';
import DisasterNewsCards from '../components/Common/DisasterNewsCards';

const NewsTickerDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Disaster News Ticker Demo
            </h1>
            <p className="text-lg text-gray-600">
              Click on news items to view detailed information in a comprehensive modal view
            </p>
          </div>

          {/* Scrolling Ticker Demo */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Scrolling News Ticker
            </h2>
            <p className="text-gray-600 mb-4">
              Horizontal scrolling ticker with hover effects and clickable detailed views:
            </p>
            <ScrollingNewsTicker 
              autoRefresh={true}
              refreshInterval={5 * 60 * 1000}
              speed="medium"
              maxItems={15}
              minSeverity="low"
              showSource={true}
              showLocation={true}
              showTime={true}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Interactive Ticker Demo */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Interactive News Ticker
            </h2>
            <p className="text-gray-600 mb-4">
              Item-by-item display with controls and enhanced hover effects:
            </p>
            <DisasterNewsTicker 
              autoRefresh={true}
              refreshInterval={5 * 60 * 1000}
              speed="medium"
              showControls={true}
              maxItems={20}
              minSeverity="low"
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Cards Demo */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Disaster News Cards
            </h2>
            <p className="text-gray-600 mb-4">
              Card-based layout with detailed information and hover effects:
            </p>
            <DisasterNewsCards 
              autoRefresh={true}
              refreshInterval={5 * 60 * 1000}
              autoSlide={true}
              slideInterval={10000}
              itemsPerSlide={3}
              maxItems={15}
              minSeverity="low"
              showControls={true}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Interactive Features
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Hover Effects:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• News items highlight on hover</li>
                  <li>• Scale and shadow effects</li>
                  <li>• Color transitions</li>
                  <li>• External link indicators appear</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Click Actions:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Opens detailed information modal</li>
                  <li>• Shows comprehensive disaster data</li>
                  <li>• Includes safety recommendations</li>
                  <li>• Links to official sources</li>
                  <li>• Displays location and severity info</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsTickerDemo;