-- RLSポリシーを更新：training_logsを全員閲覧可能に変更

-- 既存のSELECTポリシーを削除
DROP POLICY IF EXISTS "Users can view own training logs" ON training_logs;

-- 新しいSELECTポリシー: 全員閲覧可能（公開）
CREATE POLICY "Anyone can view training logs"
  ON training_logs FOR SELECT
  USING (true);
