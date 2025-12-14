"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-900/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-white">
          Training Log
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link
            href="/knowledge"
            className="text-sm text-gray-300 transition-colors hover:text-white"
          >
            知識メモ
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/record"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                記録する
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-400 hover:text-white"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
