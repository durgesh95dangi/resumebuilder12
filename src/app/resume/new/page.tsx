'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoleSelection } from '@/components/onboarding/RoleSelection';
import { JobDescriptionInput } from '@/components/onboarding/JobDescriptionInput';
import { StartingPoint } from '@/components/onboarding/StartingPoint';
import { Wizard } from '@/components/onboarding/Wizard';
import { ResumeBuilderWizard } from '@/components/builder/ResumeBuilderWizard';
import { FormError } from '@/components/ui/FormError';
import { fetchWithTimeout } from '@/lib/utils';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

type Step = 'role' | 'jd' | 'start' | 'wizard';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('role');
    const [resumeId, setResumeId] = useState<string | null>(null);
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>('');
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/users/profile');
                if (res.ok) {
                    const data = await res.json();
                    setProfileData(data);
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        }
        fetchProfile();
    }, []);

    const handleRoleSelect = async (data: { role: string; experienceLevel: string; targetRole: string }) => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetchWithTimeout('/api/resumes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to create resume');

            const newResume = await res.json();
            setResumeId(newResume.id);
            setRole(data.role);
            setStep('jd');
        } catch (error) {
            console.error('Error creating resume:', error);
            setError('Failed to create resume. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleJDSubmit = async (text?: string) => {
        if (text && resumeId) {
            setIsLoading(true);
            setError('');
            try {
                await fetchWithTimeout(`/api/resumes/${resumeId}/jd`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text }),
                });
            } catch (error) {
                console.error('Error saving JD:', error);
            } finally {
                setIsLoading(false);
            }
        }
        setStep('start');
    };

    const handleStartSelect = (mode: 'scratch' | 'import') => {
        if (mode === 'scratch') {
            setStep('wizard');
        } else {
            alert('Import feature coming soon!');
        }
    };

    // New autosave handler for the 5-step builder
    const handleAutoSave = async (data: any) => {
        if (!resumeId) return;
        try {
            // We store the rich JSON structure in 'content'
            await fetchWithTimeout(`/api/resumes/${resumeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: data, status: 'draft' }),
            });
        } catch (error) {
            console.error('Autosave error:', error);
            // Silent error for autosave to avoid disrupting user flow, 
            // or maybe show a toast (but we don't have a toast system ready here yet).
        }
    };

    const getInitialData = () => {
        // Map profile data to new schema structure if available
        if (!profileData) return undefined;
        return {
            personal: {
                fullName: profileData.name || '',
                email: profileData.email || '',
                title: role || '', // Pre-fill title from selected role
                // location: profileData.location || '', // removed
                // portfolio: profileData.portfolioUrl || '', // removed from profile but kept in resume
            },
            summary: profileData.headline || '',
            skills: { core: [], tools: [], soft: [] },
            experience: [],
            education: [],
            certifications: [],
            projects: [],
            languages: []
        };
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto mb-6">
                    <FormError message={error} />
                </div>
                {step === 'role' && <RoleSelection onNext={handleRoleSelect} />}
                {step === 'jd' && <JobDescriptionInput onNext={handleJDSubmit} onSkip={() => handleJDSubmit()} isLoading={isLoading} />}
                {step === 'start' && <StartingPoint onSelect={handleStartSelect} />}
                {step === 'wizard' && (
                    <ResumeBuilderWizard
                        initialData={getInitialData()}
                        onSave={handleAutoSave}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
