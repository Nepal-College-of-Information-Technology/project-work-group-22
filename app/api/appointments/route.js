// GET: List all appointments
// POST: Create a new appointment
export async function GET(request) {
  // TODO: Replace with real DB logic
  return new Response(JSON.stringify([{ id: 1, doctor: "Dr. Smith", patient: "John Doe" }]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  // TODO: Parse request body and create appointment in DB
  const body = await request.json();
  // Return created appointment (mock)
  return new Response(JSON.stringify({ id: 2, ...body }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
