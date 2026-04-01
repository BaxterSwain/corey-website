import { NextResponse } from "next/server";
import { createContact, getContacts, getUnreadContactsCount } from "@/lib/db";

export async function GET() {
  const contacts = await getContacts();
  const unread = await getUnreadContactsCount();

  return NextResponse.json({ contacts, unread });
}

export async function POST(req: Request) {
  const data = await req.json();
  await createContact(data);
  return NextResponse.json({ success: true });
}