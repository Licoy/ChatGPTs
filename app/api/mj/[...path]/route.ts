import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import { ModelProvider } from "@/app/constant";
import { auth } from "@/app/api/auth";

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[MJ] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const controller = new AbortController();

  const serverConfig = getServerSideConfig();

  let baseUrl = serverConfig.mjpUrl || "";

  if (!baseUrl) {
    return NextResponse.json(
      {
        error: true,
        message: `missing MJ_PROXY_URL in server env vars`,
      },
      {
        status: 500,
      },
    );
  }

  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  let path = `${req.nextUrl.pathname}`.replaceAll("/api/mj/", "");

  console.log("[MJ Proxy] ", path);
  console.log("[MJ Base Url]", baseUrl);

  const timeoutId = setTimeout(
    () => {
      controller.abort();
    },
    10 * 60 * 1000,
  );

  const authResult = auth(req, ModelProvider.Mj);

  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  const bearToken = req.headers.get("Authorization") ?? "";
  const token = bearToken.trim().replaceAll("Bearer ", "").trim();

  const key = token ? token : serverConfig.mjpApiKey;

  if (!key) {
    return NextResponse.json(
      {
        error: true,
        message: `missing MJ_PROXY_KEY in server env vars`,
      },
      {
        status: 401,
      },
    );
  }

  const fetchUrl = `${baseUrl}/${path}`;
  console.log("[MJ Url] ", fetchUrl);
  const headers = {
    "Content-Type": "application/json",
    Accept: req.headers.get("Accept") || "application/json",
    Authorization: `${key}`,
  };
  const fetchOptions: RequestInit = {
    headers,
    method: req.method,
    body: req.body,
    // to fix #2485: https://stackoverflow.com/questions/55920957/cloudflare-worker-typeerror-one-time-use-body
    redirect: "manual",
    // @ts-ignore
    duplex: "half",
    signal: controller.signal,
  };

  try {
    const res = await fetch(fetchUrl, fetchOptions);
    // to prevent browser prompt for credentials
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("www-authenticate");
    // to disable nginx buffering
    newHeaders.set("X-Accel-Buffering", "no");
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
