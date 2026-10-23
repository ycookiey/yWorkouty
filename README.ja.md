# yWorkouty

[English](README.md)

筋トレの記録を付ける1人用のWebアプリ。Next.jsとSupabaseで作り、Cloudflare Workersで動かす。利用者がそれぞれ自分の環境にデプロイして使う。記録できるのは1つのGitHubアカウントだけで、トップページは誰でも閲覧できる。

## 特徴

- `/record`の「記録する」の画面でトレーニングを記録する。部位と種目を選び、重量・回数・セット数を入力する。重量の単位はkg。種目は胸・背中・腕の9種目で、`src/lib/exercises.ts`に直接書いてある
- 「前回コピー」のボタンを押すと、選んだ種目の自分の最新の記録から、重量・回数・セット数を入力欄にコピーする
- トップページには直近12週の胸・背中・腕のセット数を1日ごとにヒートマップで表示する。トップページはサインインしなくても閲覧できる

## セットアップ

Node.js 20以降とSupabaseのプロジェクトが必要。デプロイにはCloudflareのアカウントも必要。

1. `npm ci`で依存パッケージをインストールする
2. テーブルを作成する。`npx supabase login`・`npx supabase link --project-ref <project-ref>`・`npx supabase db push`を実行して`supabase/migrations/`を適用するか、`supabase/schema.sql`をSupabaseのSQL Editorに貼り付けて実行する
3. GitHubのOAuth Appを作成し、コールバックURLを`https://<project-ref>.supabase.co/auth/v1/callback`にする。Supabaseのダッシュボードで、GitHubの認証プロバイダを有効にしてOAuth AppのClient IDとClient Secretを設定し、許可するリダイレクトURLに`<origin>/auth/callback`を追加する。例えば開発サーバーなら`http://localhost:3000/auth/callback`を追加する
4. `env.example`を`.env.local`にコピーし、`NEXT_PUBLIC_SUPABASE_URL`と`NEXT_PUBLIC_SUPABASE_ANON_KEY`に、SupabaseのプロジェクトのAPIの設定にある値を入れる。2つの値はビルドの時点で埋め込まれるため、実行時だけでなく、ビルドするときにも設定しておく
5. `src/lib/supabase/middleware.ts`の`ALLOWED_GITHUB_ID`を、自分のGitHubのユーザーIDの数値にする。ユーザーIDの数値は`gh api user --jq .id`で確認できる。ほかのアカウントで`/record`を開くと、トップページに戻される
6. `npm run dev`で開発サーバーを起動し、<http://localhost:3000>を開く

## Cloudflare Workersへのデプロイ

1. `wrangler.toml`の`name`と`account_id`を変更し、`[[routes]]`は書き換えるか削除し、`[vars]`の値は自分の値に置き換える
2. `npx wrangler login`でサインインしてから、`npm run deploy`を実行する。`npm run deploy`は、`npm run build:cf`でOpenNextのビルドをしてから`wrangler deploy`を実行する

`main`にpushするたびに、`.github/workflows/deploy.yml`のワークフローでデプロイする。デプロイにはリポジトリのsecretsの`CLOUDFLARE_API_TOKEN`・`CLOUDFLARE_ACCOUNT_ID`・`NEXT_PUBLIC_SUPABASE_URL`・`NEXT_PUBLIC_SUPABASE_ANON_KEY`を使う。4つのsecretsを設定するか、ワークフローを削除する。

## 既知の制限

- 記録はすべて公開される。誰でもSupabaseのAPIで`training_logs`の全行を読み取れるうえ、トップページには全ユーザーの記録を表示する
- GitHubのIDの確認で保護されるのは`/record`のページだけ。確認に使う`user_metadata`は、サインインしたユーザーが自分で書き換えられる。データベースのポリシーでは、サインインしたユーザーなら誰でもSupabaseのAPIで自分の行を追加・更新・削除でき、追加した行はトップページに表示される
- 記録した時点のUTCの日付を保存する
- 「知識メモ」のページに表示されるのは仮のメモで、メモのリンク先のページは存在しない
- 画面の文言は日本語だけ

## ビルド

```bash
npm ci
npm run build      # Next.jsの本番用のビルド
npm run build:cf   # Cloudflare Workers用のバンドルを.open-next/に出力
```

## ライセンス

[MIT](LICENSE)
