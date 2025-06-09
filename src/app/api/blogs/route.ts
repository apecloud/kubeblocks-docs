import { getBlogs } from "@/utils/markdown";
import { NextResponse } from "next/server";

export const dynamic = 'force-static'; // force-dynamic | force-static

export async function GET() {
  const blogs = await getBlogs();
  return NextResponse.json({ data: blogs });
}
