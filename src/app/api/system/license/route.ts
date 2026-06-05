import { NextResponse } from 'next/server';
import { verifyLicense } from '@/utils/verifyLicense';

export async function GET() {
  try {
    const rawPublicKey = process.env.NEXT_PUBLIC_LICENSE_PUBLIC_KEY;
    const licenseKey = process.env.LICENSE_KEY;

    if (!rawPublicKey || !licenseKey) {
      return NextResponse.json({ activeModules: [], error: 'Configuration missing' }, { status: 500 });
    }

    const publicKey = rawPublicKey.replace(/\\n/g, '\n');
    const activeModules = verifyLicense(licenseKey, publicKey);

    return NextResponse.json({ activeModules });
  } catch (error: any) {
    return NextResponse.json({ activeModules: [], error: error.message }, { status: 400 });
  }
}
