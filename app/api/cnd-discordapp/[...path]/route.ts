import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth";

async function handle(req: NextRequest) {
  const reqPath = `${req.nextUrl.pathname}`.replaceAll(
    "/api/cnd-discordapp/",
    "",
  );

  let fetchUrl = `https://cdn.discordapp.com/${reqPath}`;
  console.log("[MJ CDN URL] ", fetchUrl);
  return await fetch(fetchUrl, {
    method: req.method,
    body: req.body,
    cache: "no-store",
  });
}

export const GET = handle;
