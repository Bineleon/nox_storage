import { NextResponse } from "next/server";
import { getServerApiBaseUrl } from "@/lib/api";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid multipart body" }, { status: 400 });
  }

  const upstream = `${getServerApiBaseUrl()}/inventory-items/${id}/photos`;
  const res = await fetch(upstream, { method: "POST", body: formData });
  const text = await res.text();
  const contentType = res.headers.get("content-type") ?? "application/json";
  return new NextResponse(text, { status: res.status, headers: { "content-type": contentType } });
}
