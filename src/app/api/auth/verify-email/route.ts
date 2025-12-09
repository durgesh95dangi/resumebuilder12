import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, emailVerificationTokens } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        // Verify token
        const verificationToken = await db.select()
            .from(emailVerificationTokens)
            .where(and(
                eq(emailVerificationTokens.token, token),
                gt(emailVerificationTokens.expiresAt, new Date())
            ))
            .get();

        if (!verificationToken) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Update user
        await db.update(users)
            .set({ emailVerified: new Date(), updatedAt: new Date() })
            .where(eq(users.id, verificationToken.userId));

        // Delete used token
        await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Verify email error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
