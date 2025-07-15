import VideoCall from "./video-call-ui";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default async function VideoCallPage({ searchParams }) {
  const { sessionId, token } = await searchParams;

  return <VideoCall sessionId={sessionId} token={token} />;
}
