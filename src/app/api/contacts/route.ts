import { NextResponse, NextRequest } from "next/server";
import { createContact, getContacts, getUnreadContactsCount } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const enquiryType = searchParams.get('enquiryType') || '';
  const sortBy = (searchParams.get('sortBy') || 'createdat').toLowerCase(); // PostgreSQL columns are lowercase
  const order = searchParams.get('order') || 'desc';

  const contacts = await getContacts({ query, enquiryType, sortBy, order });
  const unread = await getUnreadContactsCount();

  return NextResponse.json({ contacts, unread });
}

export async function POST(req: Request) {
  const data = await req.json();
  await createContact(data);
  return NextResponse.json({ success: true });
}