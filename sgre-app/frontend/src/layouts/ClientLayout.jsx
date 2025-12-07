import React from 'react';
import ClientSidebar from '../components/ClientSidebar';
import ClientHeader from '../components/ClientHeader';
import Footer from '../components/Footer';

const ClientLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ClientHeader />
      <div className="flex flex-1">
        <ClientSidebar />
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ClientLayout;