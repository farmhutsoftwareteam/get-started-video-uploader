import Link from 'next/link';
import { UploadCloud } from 'lucide-react';

const Layout = ({ children ,toggleModal }) => {
  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-white">
            <Link legacyBehavior  href="/">
              <a className="text-xl font-bold">Video Management Tool</a>
            </Link>
          </div>
          <div>
          <button
          onClick={toggleModal}
          className="bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium ml-4 inline-flex items-center"
        >
          <UploadCloud className="mr-2" /> Upload New Video
        </button>
            {/* Add more navigation links here */}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
};

export default Layout;