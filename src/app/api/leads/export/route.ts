import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { leadsStore } from "@/lib/store/leads.store";
import { toCsv } from "@/lib/csv";

const validTypes = ["quoteRequests", "contactMessages", "newsletterSubscribers"] as const;

type LeadType = (typeof validTypes)[number];

function isLeadType(value: string | null): value is LeadType {
  return !!value && (validTypes as readonly string[]).includes(value);
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  if (!isLeadType(type)) {
    return NextResponse.json({ error: "Invalid or missing type" }, { status: 400 });
  }

  const rows = (await leadsStore.getAll())[type];
  const csv = toCsv(rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${type}.csv"`,
    },
  });
}
