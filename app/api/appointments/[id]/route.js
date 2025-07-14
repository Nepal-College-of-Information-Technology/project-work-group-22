// GET: Get appointment by ID
// PUT: Update appointment by ID
// DELETE: Delete appointment by ID
export async function GET(request, { params }) {
  // TODO: Replace with real DB logic
  const { id } = params;
  return new Response(JSON.stringify({ id, doctor: "Dr. Smith", patient: "John Doe" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(request, { params }) {
  // TODO: Parse request body and update appointment in DB
  const { id } = params;
  const body = await request.json();
  return new Response(JSON.stringify({ id, ...body }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(request, { params }) {
  // TODO: Delete appointment from DB
  const { id } = params;
  return new Response(null, { status: 204 });
}
