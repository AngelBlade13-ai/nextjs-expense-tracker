"use client";

import { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "@/lib/store/auth-context";

function SignIn() {
  const { googleLoginHandler } = useContext(AuthContext);

  return (
    <main className="container max-w-2xl px-6 mx-auto">
      <h1 className="mb-6 text-6xl font-bold text-center">Welcome 👋</h1>

      <div className="flex flex-col overflow-hidden shadow-md shadow-slate-500 bg-slate-800 rounded-2xl">
        <div className="h-52">
          <img
            className="object-cover w-full h-full"
            src="https://images.pexels.com/photos/4386398/pexels-photo-4386398.jpeg"
            alt="Finance tracker sign in"
          />
        </div>

        <div className="px-4 py-10">
          <h3 className="text-2xl text-center">Please sign in to continue</h3>
          <button
            type="button"
            onClick={googleLoginHandler}
            className="flex self-start gap-2 p-4 mx-auto mt-6 font-medium text-white items-center bg-gray-700 rounded-lg"
          >
            <FcGoogle className="text-2xl" />
            Sign In With Google
          </button>
        </div>
      </div>
    </main>
  );
}

export default SignIn;
