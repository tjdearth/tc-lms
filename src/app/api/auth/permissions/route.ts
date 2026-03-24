import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin, isCourseCreator } from "@/lib/admin";
import { getGmBrand } from "@/lib/admin-server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  const isGlobalAdmin = isAdmin(email);
  const isGlobalCourseCreator = isCourseCreator(email);
  const gmForBrand = await getGmBrand(email);

  return NextResponse.json({
    isGlobalAdmin,
    isGlobalCourseCreator,
    gmForBrand,
  });
}
