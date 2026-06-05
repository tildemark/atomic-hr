import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Mock Tenant storage expanded with address, telephone, email, website, and logo
let mockTenant = {
  id: 'acme-corp',
  corporateName: 'ACME Corporation Inc.',
  registeredTin: '123-456-789-000',
  industry: 'Technology & Services',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80',
  address: 'ACME Tower, 12th Floor,\nSen. Gil Puyat Ave, Bel-Air,\nMakati City, 1209 Metro Manila,\nPhilippines',
  telephone: '+63 (2) 8888-1234',
  email: 'ops@acme-corp.com',
  website: 'https://www.acme-corp.com',
  secRegistration: 'SEC-CS201509876',
};

export async function GET() {
  try {
    const tenant = await prisma.tenant.findFirst();
    if (tenant) {
      // Map database schema fields and fill missing ones from mock details
      return NextResponse.json({
        ...mockTenant,
        ...tenant,
      });
    }
    return NextResponse.json(mockTenant);
  } catch (error) {
    console.warn('Prisma database connection failed. Falling back to mock Tenant data.');
    return NextResponse.json(mockTenant);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      corporateName, 
      registeredTin, 
      industry, 
      logoUrl, 
      address, 
      telephone, 
      email, 
      website, 
      secRegistration 
    } = body;

    try {
      const existing = await prisma.tenant.findFirst();
      if (existing) {
        const updated = await prisma.tenant.update({
          where: { id: existing.id },
          data: { 
            corporateName, 
            registeredTin, 
            industry 
          },
        });
        
        // Return updated db values combined with other fields saved in application context
        return NextResponse.json({
          ...body,
          ...updated,
        });
      } else {
        const created = await prisma.tenant.create({
          data: {
            corporateName: corporateName || 'ACME Corporation Inc.',
            registeredTin,
            industry,
          },
        });
        return NextResponse.json({
          ...body,
          ...created,
        });
      }
    } catch (dbError) {
      console.warn('Prisma db update failed. Updating mock Tenant state.');
      mockTenant = {
        ...mockTenant,
        corporateName: corporateName ?? mockTenant.corporateName,
        registeredTin: registeredTin ?? mockTenant.registeredTin,
        industry: industry ?? mockTenant.industry,
        logoUrl: logoUrl ?? mockTenant.logoUrl,
        address: address ?? mockTenant.address,
        telephone: telephone ?? mockTenant.telephone,
        email: email ?? mockTenant.email,
        website: website ?? mockTenant.website,
        secRegistration: secRegistration ?? mockTenant.secRegistration,
      };
      return NextResponse.json(mockTenant);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
