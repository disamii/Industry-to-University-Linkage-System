import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const dynamic = "force-dynamic";

async function handle(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }, // Update type to Promise
) {
  // 1. Unwrap params and cookies
  const { path } = await params;
  const cookieStore = await cookies();

  const url = new URL(req.url);

  // 2. Use the unwrapped 'path'
  const joinedPath = path.join("/").replace(/\/?$/, "/");
  const target = `${BASE_URL}/${joinedPath}${url.search}`;

  const headers: Record<string, string> = {};

  const contentType = req.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  const access_token = cookieStore.get("access_token")?.value;
  if (access_token) headers["Authorization"] = `Bearer ${access_token}`;

  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (contentType?.includes("application/json")) {
      body = await req.text();
    } else {
      // For streaming bodies (multipart/form-data, etc.)
      body = req.body;
    }
  }

  const res = await fetch(target, {
    method: req.method,
    headers,
    body,
  });

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
}

export {
  handle as GET,
  handle as POST,
  handle as PUT,
  handle as PATCH,
  handle as DELETE,
};
