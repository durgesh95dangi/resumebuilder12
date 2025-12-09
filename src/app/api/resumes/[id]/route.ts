import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resumes } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { generateResumeDraft } from '@/lib/ai';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { content, role, status, atsScore } = body;

        // Generate draft if not already generated (mock AI)
        // This line is kept, but its output 'refinedContent' is no longer directly used for the 'content' field update
        // if 'content' is provided in the request body.
        // If 'content' is not provided, 'refinedContent' would not be used for the update.
        // The instruction focuses on how the 'content' field from the request body is handled.
        const refinedContent = await generateResumeDraft(content, role || 'Professional');

        const updateData: any = {
            updatedAt: new Date(),
        };

        // Conditionally add fields to updateData if they are present in the request body
        if (content !== undefined) { // Check for undefined to allow empty string or null content
            updateData.content = JSON.stringify(content);
        }
        if (role !== undefined) {
            updateData.role = role;
        }
        if (status !== undefined) {
            updateData.status = status;
        }
        if (atsScore !== undefined) {
            updateData.atsScore = atsScore;
        }

        const [updatedResume] = await db.update(resumes)
            .set(updateData)
            .where(and(eq(resumes.id, id), eq(resumes.userId, session.userId)))
            .returning();

        if (!updatedResume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json(updatedResume);
    } catch (error) {
        console.error('Error updating resume:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const [resume] = await db.select()
            .from(resumes)
            .where(and(eq(resumes.id, id), eq(resumes.userId, session.userId)))
            .limit(1);

        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
