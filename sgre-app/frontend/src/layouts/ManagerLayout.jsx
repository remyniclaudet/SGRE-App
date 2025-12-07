import React from 'react';
import { Outlet } from 'react-router-dom';
import ManagerSidebar from '../components/ManagerSidebar';
import Footer from '../components/Footer';

const ManagerLayout = () => {
  return (
    <div className="flex">
      <ManagerSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ManagerLayout;