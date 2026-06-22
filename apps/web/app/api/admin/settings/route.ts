import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // In a real implementation, you would save these to a database
    // For now, we'll just return success
    console.log("Settings saved:", body);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
