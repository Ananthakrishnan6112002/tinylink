import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(_request, { params }) {
    const { code } = await params;

    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    try {
        console.log("GET /[code] -> code =", code);

        const link = await prisma.link.findUnique({
            where: { code },
        });

        if (!link) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // update click count & lastClicked
        await prisma.link.update({
            where: { id: link.id },
            data: {
                clickCount: (link.clickCount || 0) + 1,
                lastClicked: new Date(),
            },
        });

        return NextResponse.redirect(link.url);
    } catch (err) {
        console.error(`GET /${code} error:`, err);
        return NextResponse.json({ error: "Redirect failed." }, { status: 500 });
    }
}