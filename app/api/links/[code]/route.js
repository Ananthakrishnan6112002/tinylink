import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(_request, { params }) {
  const { code } = params;

  try {
    console.log("GET /api/links/[code] -> code =", code);

    const link = await prisma.link.findFirst({
      where: { code },
    });

    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(link);
  } catch (err) {
    console.error(`GET /api/links/${code} error:`, err);
    return NextResponse.json(
      { error: "Failed to fetch link." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const { code } = params;

  try {
    console.log("DELETE /api/links/[code] -> code =", code);

    const link = await prisma.link.findFirst({
      where: { code },
    });

    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.link.delete({
      where: { id: link.id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`DELETE /api/links/${code} error:`, err);
    return NextResponse.json(
      { error: "Failed to delete link." },
      { status: 500 }
    );
  }
}
