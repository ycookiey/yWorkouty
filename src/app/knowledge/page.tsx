import { Header } from "@/components/Header";
import Link from "next/link";

// 知識メモのカテゴリ
const CATEGORIES = [
  { id: "exercises", name: "種目別", description: "各種目のフォームやポイント" },
  { id: "basics", name: "基礎知識", description: "筋トレの基本的な知識" },
  { id: "nutrition", name: "栄養・休養", description: "食事や休息について" },
];

// ダミーの知識メモ（後でSupabaseから取得）
const DUMMY_NOTES = [
  { slug: "bench-press-form", title: "ベンチプレスのフォーム", category: "exercises" },
  { slug: "progressive-overload", title: "漸進性過負荷の原則", category: "basics" },
  { slug: "protein-intake", title: "タンパク質の摂取量", category: "nutrition" },
];

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">知識メモ</h1>
        
        {/* カテゴリ別に表示 */}
        <div className="space-y-12">
          {CATEGORIES.map((category) => {
            const notes = DUMMY_NOTES.filter((n) => n.category === category.id);
            
            return (
              <section key={category.id}>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <p className="text-sm text-gray-400">{category.description}</p>
                </div>
                
                {notes.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {notes.map((note) => (
                      <Link
                        key={note.slug}
                        href={`/knowledge/${note.slug}`}
                        className="rounded-xl border border-white/10 bg-gray-900/50 p-4 transition-colors hover:border-blue-500/50 hover:bg-gray-900"
                      >
                        <h3 className="font-medium">{note.title}</h3>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">まだ記事がありません</p>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
