import { Header } from "@/components/Header";
import { BODY_PARTS, BodyPart, EXERCISES } from "@/lib/exercises";
import { createClient } from "@/lib/supabase/server";

// 部位別のカラー設定
const BODY_PART_COLORS: Record<BodyPart, string> = {
  chest: "bg-red-500",
  back: "bg-blue-500",
  arms: "bg-green-500",
  shoulders: "bg-yellow-500",
  legs: "bg-purple-500",
  core: "bg-orange-500",
};

async function getHeatmapData() {
  const supabase = await createClient();
  
  // 過去90日分のデータを取得（全ユーザー分を公開表示）
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const { data: logs } = await supabase
    .from("training_logs")
    .select("date, exercise_id, sets")
    .gte("date", ninetyDaysAgo.toISOString().split("T")[0]);
  
  // 部位ごとに日付別のセット数を集計
  const heatmapData: Record<BodyPart, Record<string, number>> = {
    chest: {},
    back: {},
    arms: {},
    shoulders: {},
    legs: {},
    core: {},
  };
  
  if (logs) {
    for (const log of logs) {
      const exercise = EXERCISES.find(e => e.id === log.exercise_id);
      if (exercise) {
        const bodyPart = exercise.bodyPart;
        const dateStr = log.date;
        heatmapData[bodyPart][dateStr] = (heatmapData[bodyPart][dateStr] || 0) + log.sets;
      }
    }
  }
  
  return heatmapData;
}

function HeatmapRow({ bodyPart, data }: { bodyPart: BodyPart; data: Record<string, number> }) {
  const today = new Date();
  const days = [];
  
  // 過去12週間分（84日）を表示
  for (let i = 83; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const sets = data[dateStr] || 0;
    
    // セット数に応じて透明度を変更
    const opacity = sets === 0 ? 0.1 : Math.min(sets / 4, 1);
    
    days.push(
      <div
        key={dateStr}
        className={`h-3 w-3 rounded-sm ${sets > 0 ? BODY_PART_COLORS[bodyPart] : "bg-gray-700"}`}
        style={{ opacity: sets > 0 ? opacity : 0.3 }}
        title={`${dateStr}: ${sets} セット`}
      />
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 text-sm text-gray-400">{BODY_PARTS[bodyPart]}</span>
      <div className="flex gap-0.5">{days}</div>
    </div>
  );
}

export default async function Home() {
  const heatmapData = await getHeatmapData();
  const displayedBodyParts: BodyPart[] = ["chest", "back", "arms"];
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Training Log</h1>
          <p className="text-gray-400">筋トレの記録を可視化</p>
        </div>
        
        {/* ヒートマップセクション */}
        <section className="rounded-2xl border border-white/10 bg-gray-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-semibold">トレーニング履歴</h2>
          
          <div className="space-y-3">
            {displayedBodyParts.map((bodyPart) => (
              <HeatmapRow
                key={bodyPart}
                bodyPart={bodyPart}
                data={heatmapData[bodyPart]}
              />
            ))}
          </div>
          
          {/* 凡例 */}
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
            <span>少ない</span>
            <div className="flex gap-1">
              {[0.1, 0.3, 0.5, 0.7, 1].map((opacity) => (
                <div
                  key={opacity}
                  className="h-3 w-3 rounded-sm bg-blue-500"
                  style={{ opacity }}
                />
              ))}
            </div>
            <span>多い</span>
          </div>
        </section>
      </main>
    </div>
  );
}
