import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    loanRequestsTotal: "3000+",
    membersTotal: "555",
    successfulMatches: "188",
    lenderMembersTotal: "0",
  });
}