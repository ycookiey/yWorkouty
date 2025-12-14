import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 許可されたGitHub ID
const ALLOWED_GITHUB_ID = "70356861";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 保護されたルートへのアクセス制御
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/record") ||
    request.nextUrl.pathname.startsWith("/history");

  if (isProtectedRoute) {
    // 未ログインの場合はログインページへ
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // GitHub IDをチェック（user_metadataからprovider_idを取得）
    const githubId = user.user_metadata?.provider_id?.toString();
    
    if (githubId !== ALLOWED_GITHUB_ID) {
      // 許可されていないユーザーはアクセス拒否
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
