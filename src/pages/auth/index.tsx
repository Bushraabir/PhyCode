import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { BeakerIcon, CodeBracketIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import AuthModal from '@/components/Modals/AuthModal';



const AuthPage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-950 via-gray-900 to-black min-h-screen text-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md" />
        
        <AuthModal />
        
       
        <footer className="text-center absolute bottom-0 text-gray-500">
          <p>&copy; {new Date().getFullYear()} PhyCode. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AuthPage;