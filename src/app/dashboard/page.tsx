import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TeacherDashboard from '@/components/screens/TeacherDashboardServer';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  // 교사 활동 목록 조회
  const { data: activities } = await supabase
    .from('activities')
    .select('id, title, created_at, groups, criteria, session_id')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // 프로필 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, school')
    .eq('id', user.id)
    .single();

  return (
    <TeacherDashboard
      activities={activities ?? []}
      teacherName={profile?.name || user.email?.split('@')[0] || '선생님'}
      school={profile?.school || ''}
    />
  );
}
