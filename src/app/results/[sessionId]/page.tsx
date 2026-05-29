import LiveResultsScreen from '@/components/screens/LiveResultsScreen';

export default async function LiveResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <LiveResultsScreen sessionId={sessionId} />;
}
