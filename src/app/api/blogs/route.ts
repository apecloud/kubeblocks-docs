import { getBlogs } from "@/utils/markdown";
import { NextResponse } from "next/server";

export async function GET() {
  const blogs = await getBlogs();
  return NextResponse.json({ data: blogs });
}
