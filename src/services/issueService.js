import { supabase } from './supabase';

export const addIssue = async (issue) => {
  const { data, error } = await supabase
    .from('issues')
    .insert(issue)
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
};

export const getIssues = async () => {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateIssue = async (id, changes) => {
  const { data, error } = await supabase
    .from('issues')
    .update(changes)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const subscribeToIssues = (onChange, onError) => {
  const channel = supabase
    .channel('issues-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, async () => {
      try {
        onChange(await getIssues());
      } catch (error) {
        onError?.(error);
      }
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
};

export const reportIssue = async (issue) => {
  const { data, error } = await supabase.rpc('report_issue', {
    p_category: issue.category,
    p_description: issue.description,
    p_image: issue.image,
    p_location: issue.location,
    p_severity: issue.severity,
    p_user_id: issue.user_id,
  });
  if (error) throw error;
  return data;
};