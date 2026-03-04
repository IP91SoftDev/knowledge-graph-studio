-- Create resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  category TEXT,
  ai_confidence FLOAT CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
  status TEXT CHECK (status IN ('verified', 'needs_review', 'ai_queue', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Users can modify resources" ON resources FOR ALL USING (auth.uid() IS NOT NULL);