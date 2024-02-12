import Link from 'next/link';
import { UploadCloud } from 'lucide-react';
import Head from 'next/head';

const Layout = ({ children ,toggleModal }) => {
  return (
    <>
      <Head>
        <title>Video Management Tool</title>
        <meta name="description" content="Manage and upload your videos with ease." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
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