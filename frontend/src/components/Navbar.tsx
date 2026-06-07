import { NavLink } from "react-router-dom";

const Navbar = () => {
  const getLinkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-sky-500 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  return (
    <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          Weather Intelligence
        </h1>

        <div className="flex gap-2">
          <NavLink
            to="/"
            className={getLinkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/records"
            className={getLinkClass}
          >
            Records
          </NavLink>

          <NavLink
            to="/records/new"
            className={getLinkClass}
          >
            Create
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;