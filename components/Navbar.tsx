"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/70 shadow-sm shadow-indigo-100/30 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-purple-600 text-lg font-bold text-white shadow-md shadow-indigo-200">
            F
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Feed<span className="text-indigo-600">Vox</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              {/* User */}
              <div className="hidden items-center rounded-full border border-indigo-100 bg-indigo-50/60 px-4 py-2 sm:flex">
                <span className="text-sm font-medium text-gray-700">
                  Welcome,{" "}
                  <span className="font-semibold text-indigo-600">
                    {user?.username || user?.email}
                  </span>
                </span>
              </div>

              {/* Logout */}
              <Button
                onClick={() => signOut()}
                className="rounded-xl border border-gray-200 bg-white px-4 font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-5 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
