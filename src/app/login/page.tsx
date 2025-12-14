"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert("ログインに失敗しました: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">サインイン</h1>
        <p className="mb-8 text-center text-gray-400">
          GitHubアカウントでログインしてください
        </p>

        <button
          onClick={handleGitHubLogin}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#24292F] px-6 py-3 font-medium text-white transition-colors hover:bg-[#24292F]/90 disabled:opacity-50"
        >
          {isLoading ? (
            "処理中..."
          ) : (
            <>
              <svg
                height="20"
                viewBox="0 0 16 16"
                width="20"
                className="fill-current"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              GitHubで続ける
            </>
          )}
        </button>
      </div>
    </div>
  );
}
