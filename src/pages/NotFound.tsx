import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
      <FileQuestion className="h-20 w-20 text-blue-500 mb-6" />
      <h1 className="text-4xl font-bold text-slate-800 mb-4">Page Not Found</h1>
      <p className="text-slate-600 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;