import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

let mockBranches = [
  { 
    id: 'b1-uuid', 
    name: 'Manila Head Office', 
    region: 'Metro Manila', 
    isHeadquarters: true, 
    address: 'ACME Tower, 12th Floor,\nSen. Gil Puyat Ave, Bel-Air,\nMakati City, 1209 Metro Manila',
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'b2-uuid', 
    name: 'Cebu Branch', 
    region: 'Visayas', 
    isHeadquarters: false, 
    address: 'HM Tower, 7th Floor,\nGeonzon St, Cebu IT Park,\nLahug, Cebu City, 6000 Cebu',
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'b3-uuid', 
    name: 'Davao Office', 
    region: 'Mindanao', 
    isHeadquarters: false, 
    address: 'Damosa Gateway, Tower B,\nLanang, Davao City, 8000 Davao del Sur',
    createdAt: new Date().toISOString() 
  },
];

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { name: 'asc' },
    });
    
    if (branches.length > 0) {
      // Map database results and attach mock address properties if database fields are missing
      return NextResponse.json(branches.map((b: any) => {
        const found = mockBranches.find(mb => mb.id === b.id);
        return {
          id: b.id,
          name: b.name,
          region: b.region,
          isHeadquarters: b.isHeadquarters,
          address: found?.address || 'Philippine Office Location Address',
          createdAt: b.createdAt,
        };
      }));
    }
    return NextResponse.json(mockBranches);
  } catch (error) {
    console.warn('Prisma database connection failed. Falling back to mock branches.');
    return NextResponse.json(mockBranches);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, region, isHeadquarters, address } = body;

    if (!name) {
      return NextResponse.json({ error: 'Branch name is required' }, { status: 400 });
    }

    try {
      if (isHeadquarters) {
        await prisma.branch.updateMany({
          data: { isHeadquarters: false },
        });
      }
      
      const newBranch = await prisma.branch.create({
        data: {
          name,
          region,
          isHeadquarters: !!isHeadquarters,
        },
      });
      return NextResponse.json({
        id: newBranch.id,
        name: newBranch.name,
        region: newBranch.region,
        isHeadquarters: newBranch.isHeadquarters,
        address: address || 'No address specified',
        createdAt: newBranch.createdAt,
      });
    } catch (dbError) {
      console.warn('Prisma insert failed. Inserting into mock branches.');
      if (isHeadquarters) {
        mockBranches = mockBranches.map(b => ({ ...b, isHeadquarters: false }));
      }
      const newMock = {
        id: `mock-branch-${Date.now()}`,
        name,
        region,
        isHeadquarters: !!isHeadquarters,
        address: address || '',
        createdAt: new Date().toISOString(),
      };
      mockBranches.push(newMock);
      return NextResponse.json(newMock);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, region, isHeadquarters, address } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'Branch ID and name are required' }, { status: 400 });
    }

    try {
      if (isHeadquarters) {
        await prisma.branch.updateMany({
          data: { isHeadquarters: false },
        });
      }
      
      const updated = await prisma.branch.update({
        where: { id },
        data: { name, region, isHeadquarters: !!isHeadquarters },
      });
      return NextResponse.json({
        id: updated.id,
        name: updated.name,
        region: updated.region,
        isHeadquarters: updated.isHeadquarters,
        address: address || 'No address specified',
      });
    } catch (dbError) {
      console.warn('Prisma update failed. Updating mock branch.');
      if (isHeadquarters) {
        mockBranches = mockBranches.map(b => ({ ...b, isHeadquarters: false }));
      }
      mockBranches = mockBranches.map(b => 
        b.id === id ? { ...b, name, region, isHeadquarters: !!isHeadquarters, address: address || b.address } : b
      );
      const updatedMock = mockBranches.find(b => b.id === id);
      return NextResponse.json(updatedMock || { id, name, region, isHeadquarters, address });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Branch ID is required' }, { status: 400 });
    }

    try {
      await prisma.branch.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.warn('Prisma delete failed. Deleting from mock branches.');
      mockBranches = mockBranches.filter(b => b.id !== id);
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
