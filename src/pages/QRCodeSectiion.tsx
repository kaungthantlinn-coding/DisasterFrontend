// components/QRCodeSection.tsx
import React, { useState } from 'react';

const QRCodeSection: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Scan to Donate</h2>
      
      {/* KPay QR Code */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-blue-800 font-bold">K</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">KPay</h3>
        </div>
        
        <div className="flex justify-center mb-4">
          <div className="border-4 border-white shadow-lg rounded-lg p-3 bg-white">
            <div className="w-40 h-40 bg-blue-50 flex items-center justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=KPayDonation:0987654321001234" 
                alt="KPay QR Code" 
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <p className="text-xs text-blue-800 font-medium mb-1">KPay Account Number</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-mono text-blue-900">0987 6543 2100 1234</p>
            <button 
              onClick={() => handleCopy("0987654321001234", "kpay")}
              className="text-blue-700 hover:text-blue-900"
            >
              {copied === "kpay" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* WavePay QR Code */}
      <div>
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <span className="text-green-800 font-bold">W</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">WavePay</h3>
        </div>
        
        <div className="flex justify-center mb-4">
          <div className="border-4 border-white shadow-lg rounded-lg p-3 bg-white">
            <div className="w-40 h-40 bg-green-50 flex items-center justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=WavePayDonation:09123456789" 
                alt="WavePay QR Code" 
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-green-800 font-medium mb-1">WavePay Phone Number</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-mono text-green-900">09 479 456 789</p>
            <button 
              onClick={() => handleCopy("09123456789", "wavepay")}
              className="text-green-700 hover:text-green-900"
            >
              {copied === "wavepay" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-medium text-gray-900 mb-2 text-sm">How to use:</h4>
        <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1">
          <li>Open your payment app</li>
          <li>Tap on 'Scan' from the menu</li>
          <li>Point camera at the QR code</li>
          <li>Enter donation amount</li>
          <li>Confirm payment</li>
        </ol>
      </div>
    </div>
  );
};

export default QRCodeSection;