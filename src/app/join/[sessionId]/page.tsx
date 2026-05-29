import JoinScreen from '@/components/screens/JoinScreen';

export default async function JoinPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <JoinScreen sessionId={sessionId} />;
}
