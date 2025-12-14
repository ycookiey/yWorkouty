"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { EXERCISES, BODY_PARTS, getExercisesByBodyPart, BodyPart, getExerciseById } from "@/lib/exercises";
import { createClient } from "@/lib/supabase/client";

export default function RecordPage() {
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>("chest");
  const [selectedExercise, setSelectedExercise] = useState(EXERCISES[0].id);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const supabase = createClient();
  const exercises = getExercisesByBodyPart(selectedBodyPart);
  
  const handleBodyPartChange = (bodyPart: BodyPart) => {
    setSelectedBodyPart(bodyPart);
    const firstExercise = getExercisesByBodyPart(bodyPart)[0];
    if (firstExercise) {
      setSelectedExercise(firstExercise.id);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setMessage({ type: "error", text: "ログインしてください" });
      setIsSubmitting(false);
      return;
    }
    
    const { error } = await supabase.from("training_logs").insert({
      user_id: user.id,
      date: new Date().toISOString().split("T")[0],
      exercise_id: selectedExercise,
      weight: parseFloat(weight),
      reps: parseInt(reps),
      sets: parseInt(sets),
    });
    
    if (error) {
      setMessage({ type: "error", text: `エラー: ${error.message}` });
    } else {
      const exercise = getExerciseById(selectedExercise);
      setMessage({ type: "success", text: `${exercise?.name || selectedExercise} を記録しました！` });
      // 入力をリセット
      setWeight("");
      setReps("");
      setSets("");
    }
    
    setIsSubmitting(false);
  };
  
  const handleCopyPrevious = async () => {
    setMessage(null);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // 同じ部位の前回の記録を取得
    const exerciseIds = getExercisesByBodyPart(selectedBodyPart).map(e => e.id);
    
    const { data, error } = await supabase
      .from("training_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("exercise_id", selectedExercise)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      setMessage({ type: "error", text: "前回の記録が見つかりません" });
      return;
    }
    
    setWeight(data.weight.toString());
    setReps(data.reps.toString());
    setSets(data.sets.toString());
    setMessage({ type: "success", text: "前回の記録をコピーしました" });
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">記録する</h1>
        
        {/* メッセージ表示 */}
        {message && (
          <div
            className={`mb-6 rounded-lg p-4 ${
              message.type === "success"
                ? "bg-green-900/50 text-green-300"
                : "bg-red-900/50 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 部位選択 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">
              部位
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(BODY_PARTS) as BodyPart[])
                .filter((bp) => getExercisesByBodyPart(bp).length > 0)
                .map((bodyPart) => (
                  <button
                    key={bodyPart}
                    type="button"
                    onClick={() => handleBodyPartChange(bodyPart)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      selectedBodyPart === bodyPart
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {BODY_PARTS[bodyPart]}
                  </button>
                ))}
            </div>
          </div>
          
          {/* 種目選択 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">
              種目
            </label>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            >
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* 重量・回数・セット */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                重量 (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.5"
                min="0"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                回数
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                min="1"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                セット
              </label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                min="1"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>
          
          {/* アクションボタン */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCopyPrevious}
              className="rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-700"
            >
              前回コピー
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "記録中..." : "記録する"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
