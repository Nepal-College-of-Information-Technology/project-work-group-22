// Simple API route for demonstration
export async function GET(request) {
  return new Response(JSON.stringify({ message: "Hello from the API!" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
