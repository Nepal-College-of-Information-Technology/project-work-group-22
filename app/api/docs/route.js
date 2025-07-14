import { openApiSpec } from "../docs/openapi";

export async function GET() {
  return new Response(JSON.stringify(openApiSpec), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
