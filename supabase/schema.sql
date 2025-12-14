-- Training Logs: 筋トレ記録
CREATE TABLE IF NOT EXISTS training_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  exercise_id TEXT NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  reps INTEGER NOT NULL,
  sets INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Knowledge Notes: 知識メモ
CREATE TABLE IF NOT EXISTS training_knowledge_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security for training_logs
ALTER TABLE training_logs ENABLE ROW LEVEL SECURITY;

-- ポリシー: 全員閲覧可能（公開）
DROP POLICY IF EXISTS "Users can view own training logs" ON training_logs;
CREATE POLICY "Anyone can view training logs"
  ON training_logs FOR SELECT
  USING (true);

-- ポリシー: 自分の記録のみ作成可能
DROP POLICY IF EXISTS "Users can insert own training logs" ON training_logs;
CREATE POLICY "Users can insert own training logs"
  ON training_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ポリシー: 自分の記録のみ更新可能
DROP POLICY IF EXISTS "Users can update own training logs" ON training_logs;
CREATE POLICY "Users can update own training logs"
  ON training_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- ポリシー: 自分の記録のみ削除可能
DROP POLICY IF EXISTS "Users can delete own training logs" ON training_logs;
CREATE POLICY "Users can delete own training logs"
  ON training_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Row Level Security for training_knowledge_notes
ALTER TABLE training_knowledge_notes ENABLE ROW LEVEL SECURITY;

-- ポリシー: 公開済みの知識メモは誰でも閲覧可能
DROP POLICY IF EXISTS "Anyone can view published notes" ON training_knowledge_notes;
CREATE POLICY "Anyone can view published notes"
  ON training_knowledge_notes FOR SELECT
  USING (published = true);

-- インデックス: パフォーマンス向上
CREATE INDEX IF NOT EXISTS idx_training_logs_user_date 
  ON training_logs(user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_training_logs_exercise 
  ON training_logs(exercise_id);

CREATE INDEX IF NOT EXISTS idx_training_knowledge_notes_category 
  ON training_knowledge_notes(category);
