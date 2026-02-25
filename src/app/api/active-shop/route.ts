import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/active-shop`,
            {
                method: "GET",
                headers: {
                    // 🔥 forward cookie proprement
                    Cookie: req.headers.get("cookie") || "",
                },
                cache: "no-store",
            }
        );

        const data = await res.json();

        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json({ error: "Proxy error" }, { status: 500 });
    }
}
