import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("profiles")
      .select(`
        id,
        email,
        full_name,
        role,
        membership_plan,
        membership_status,
        membership_expires_at,
        admin_note,
        created_at,
        updated_at
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    const members =
      (data || []).map((member) => ({
        ...member,

        uid: member.id,
      }));

    return NextResponse.json({
      success: true,
      members,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        error:
          error.message ||
          "讀取會員失敗",
      },
      { status: 500 }
    );
  }
}