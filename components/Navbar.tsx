"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Settings, User2 } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const router = useRouter();

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
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-xl px-4 py-2 font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                  {user?.username || user?.email}
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <User2 className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setLogoutDialogOpen(true)}
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialog
                open={logoutDialogOpen}
                onOpenChange={setLogoutDialogOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to log out?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                      You will need to log in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      onClick={() => signOut()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
