import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/app/api/auth";

async function handle(
    req: NextRequest,
) {

    const authResult = auth(req);
    if (authResult.error) {
        return NextResponse.json(authResult, {
            status: 401,
        });
    }

    const reqPath = `${req.nextUrl.pathname}`.replaceAll(
        "/api/cnd-discordapp/",
        "",
    );

    let fetchUrl = `https://cdn.discordapp.com/${reqPath}`;
    return await fetch(fetchUrl, {method: req.method, body: req.body,cache: "no-store"});
}

export const GET = handle;