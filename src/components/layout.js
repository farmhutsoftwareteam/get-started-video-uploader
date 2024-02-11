import Link from 'next/link';

const Layout = ({ children }) => {
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
            <Link legacyBehavior href="/about">
              <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
            </Link>
            <Link href="/contact">
              <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</a>
            </Link>
            {/* Add more navigation links here */}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
};

export default Layout;