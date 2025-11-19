import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function generateRandomCode(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => {
    const i = Math.floor(Math.random() * chars.length);
    return chars[i];
  }).join("");
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(links);
  } catch (err) {
    console.error("GET /api/links error:", err);
    return NextResponse.json(
      { error: "Failed to load links." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, code: customCode } = body;

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL. Please include http:// or https://." },
        { status: 400 }
      );
    }

    let code = customCode?.trim();

    if (code) {
      if (!CODE_REGEX.test(code)) {
        return NextResponse.json(
          { error: "Code must be 6–8 chars, letters and digits only." },
          { status: 400 }
        );
      }

      // If code exists, return 409
      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing) {
        return NextResponse.json(
          { error: "Code already exists. Please choose another." },
          { status: 409 }
        );
      }
    } else {
      // generate a fresh, unused random code
      for (;;) {
        const candidate = generateRandomCode(6);
        const existing = await prisma.link.findUnique({
          where: { code: candidate },
        });
        if (!existing) {
          code = candidate;
          break;
        }
      }
    }

    const link = await prisma.link.create({
      data: { code, url },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    console.error("POST /api/links error:", err);
    return NextResponse.json(
      { error: "Something went wrong while creating link." },
      { status: 500 }
    );
  }
}
