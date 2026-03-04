-- Create activity_log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('ai_auto', 'manual_approve', 'manual_reject', 'system', 'alert')),
  description TEXT NOT NULL,
  resource_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_activity_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

-- RLS policies for resources table
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Users can modify resources" ON resources FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS policies for activity_log table
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all activity" ON activity_log FOR SELECT USING (true);
CREATE POLICY "Users can insert activity" ON activity_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);