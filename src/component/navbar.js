import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-600 font-semibold"
      : "text-gray-600 hover:text-indigo-600";

  return (
    <nav className="w-[95%] mx-auto mt-4 mb-6 border rounded-lg shadow-sm bg-gray-100">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link
          to="/"
          className="text-lg font-bold text-gray-800 hover:text-indigo-600 transition"
        >
          CS Dashboard
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
         {/* <Link to="/" className={isActive("/")}>
            Home
          </Link>

          <Link to="/sample" className={isActive("/sample")}>
            Sample Pages
          </Link> */}

          <Link to="/orders" className={isActive("/orders")}>
            Orders
          </Link>
        </div>
      </div>
    </nav>
  );
}
