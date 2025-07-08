-- Create function to increment feature usage
CREATE OR REPLACE FUNCTION increment_feature_usage(
  p_user_id uuid,
  p_feature_key text
) RETURNS void AS $$
BEGIN
  INSERT INTO usage_tracking (user_id, feature_key, usage_count, last_used_at)
  VALUES (p_user_id, p_feature_key, 1, now())
  ON CONFLICT (user_id, feature_key)
  DO UPDATE SET
    usage_count = usage_tracking.usage_count + 1,
    last_used_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_feature_usage TO authenticated; 