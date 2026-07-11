import { NextRequest, NextResponse } from 'next/server';

import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid or expired session.' }, { status: 401 });
    }

    const items = await sql`
      SELECT id, user_id, item_name, person_name, is_borrowed, lent_at, returned_at, notes
      FROM items
      WHERE user_id = ${payload.id}
    `;

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false, error: 'Failed to fetch items.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid or expired session.' }, { status: 401 });
    }

    const { id, item_name, person_name, notes } = await req.json();

    const rows = await sql`
      UPDATE items
      SET
        item_name = ${item_name},
        person_name = ${person_name},
        notes = ${notes}
      WHERE id = ${id} AND user_id = ${payload.id}
      RETURNING id, user_id, item_name, person_name, is_borrowed, lent_at, returned_at, notes;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Item not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: rows[0] });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false, error: 'Failed to update item.' }, { status: 500 });
  }
}
