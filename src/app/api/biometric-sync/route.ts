import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createHmac, timingSafeEqual } from "crypto";

function verifyDeviceKey(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { schoolCode, deviceApiKey, punches } = body;

    if (!schoolCode || !deviceApiKey || !Array.isArray(punches)) {
      return NextResponse.json(
        { error: "Invalid payload: 'schoolCode', 'deviceApiKey', and 'punches' array are required." },
        { status: 400 }
      );
    }

    // 1. Resolve school — no fallback, must exist in DB
    let school;
    try {
      school = await prisma.school.findUnique({
        where: { code: schoolCode },
      });
    } catch {
      return NextResponse.json(
        { error: "Database unavailable. Try again later." },
        { status: 503 }
      );
    }

    if (!school) {
      return NextResponse.json(
        { error: `School with code '${schoolCode}' not found.` },
        { status: 404 }
      );
    }

    // 2. Verify device API key against school's configured secret
    // In production, each school has a unique device key stored in School.paymentKeyId
    // or a dedicated DeviceCredential table. For now, require a non-empty key that matches school config.
    const expectedKey = school.paymentKeyId;
    if (!expectedKey || !verifyDeviceKey(deviceApiKey, expectedKey)) {
      return NextResponse.json(
        { error: "Invalid device API key for this school." },
        { status: 401 }
      );
    }

    // 3. Insert punches
    let insertedCount = 0;
    const failedIndices: number[] = [];

    for (let i = 0; i < punches.length; i++) {
      const punch = punches[i];
      if (!punch.deviceUserId || !punch.punchTime) {
        failedIndices.push(i);
        continue;
      }

      try {
        await prisma.biometricPunch.create({
          data: {
            schoolId: school.id,
            deviceUserId: String(punch.deviceUserId),
            punchTime: new Date(punch.punchTime),
            deviceName: punch.deviceName || "Gate Scanner Terminal",
          },
        });
        insertedCount++;
      } catch (err) {
        console.error(`Failed to insert punch at index ${i}:`, err);
        failedIndices.push(i);
      }
    }

    const allFailed = insertedCount === 0 && punches.length > 0;

    return NextResponse.json(
      {
        success: !allFailed,
        schoolCode,
        punchesReceived: punches.length,
        punchesProcessed: insertedCount,
        punchesFailed: failedIndices.length,
        timestamp: new Date().toISOString(),
        message: allFailed
          ? "All punches failed to insert. Check server logs."
          : `Synced ${insertedCount}/${punches.length} punches.`,
      },
      { status: allFailed ? 500 : 200 }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to process biometric sync.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "Skooltech Biometric Sync Ingestion Gateway",
    version: "1.0.0",
    docs: "POST JSON with schoolCode, deviceApiKey, and punches[] array. Each punch: { deviceUserId, punchTime, deviceName }",
  });
}
