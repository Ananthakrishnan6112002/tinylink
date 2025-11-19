import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  console.log("Redirect /r/[code] params =", params);
  const { code } = params || {};

  if (!code) {
    return new NextResponse("Missing code", { status: 400 });
  }

  try {
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return new NextResponse("Not found", { status: 404 });
    }

    await prisma.link.update({
      where: { code },
      data: {
        clickCount: { increment: 1 },
        lastClicked: new Date(),
      },
    });

    return NextResponse.redirect(link.url, 302);
  } catch (err) {
    console.error("Redirect error for code", code, err);
    return new NextResponse(
      "Internal error: " + (err?.message || "unknown"),
      { status: 500 }
    );
  }
}
