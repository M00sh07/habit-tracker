import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b">
      <h1 className="text-xl font-semibold">
        Hello, {user?.email} 👋
      </h1>

      <div className="flex gap-3">
        <Link to="/add">
          <button className="bg-blue-600 px-4 py-2 rounded text-white">
            + Add Habit
          </button>
        </Link>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
