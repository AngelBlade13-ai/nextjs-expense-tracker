"use client";

import { useContext } from "react";
import { ImStatsBars } from "react-icons/im";
import { AuthContext } from "@/lib/store/auth-context";

function Nav() {
  const { user, loading, logout } = useContext(AuthContext);

  if (!user || loading) {
    return null;
  }

  return (
    <header className="container max-w-2xl px-6 py-6 mx-auto ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
            <img
              referrerPolicy="no-referrer"
              className="object-cover w-full h-full"
              src={user.photoURL}
              alt={user.displayName}
            />
          </div>
          <small>Hi, {user.displayName}!</small>
        </div>

        <nav className="flex items-center gap-4">
          <a href="#stats">
            <ImStatsBars className="text-2xl" />
          </a>
          <div>
            <button type="button" onClick={logout} className="btn btn-danger">
              Sign Out
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Nav;
