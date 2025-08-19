import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import SupportRequestForm from '../components/SupportRequestForm';

const SupportRequestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="navbar-spacing">
        <SupportRequestForm />
      </main>
      <Footer />
    </div>
  );
};

export default SupportRequestPage;