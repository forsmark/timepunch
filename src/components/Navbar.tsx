import { Link, useNavigate } from "@tanstack/react-router";
import { signOut, useAuthStore } from "../utils/auth";
import Button from "./Button";

const Navbar = () => {
  const { signedIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    void signOut();
    void navigate({ to: "/login" });
  };

  return (
    <div className="bg-slate-800 flex items-center justify-between w-full p-4 mb-8 shadow">
      <Link to="/">
        <div className="bg-slate-700 flex items-center gap-2 p-2 rounded cursor-pointer">
          <p className="text-3xl">⏰</p>
          <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text md:text-3xl inline-block text-2xl text-transparent">
            Time Punch
          </h1>
        </div>
      </Link>

      {signedIn && (
        <Button
          className="md:w-32 w-24"
          onClick={handleSignOut}
          disabled={!signedIn}
        >
          Sign out
        </Button>
      )}
    </div>
  );
};

export default Navbar;
