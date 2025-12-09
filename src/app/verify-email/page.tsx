'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch('/api/auth/verify-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Failed to verify email.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred. Please try again.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
                {status === 'loading' && (
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verifying your email...</h2>
                        <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                )}
                {status === 'success' && (
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-green-600">Email Verified!</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Your email has been successfully verified.
                        </p>
                        <div className="mt-6">
                            <Link href="/auth/sign-in" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Sign in to your account
                            </Link>
                        </div>
                    </div>
                )}
                {status === 'error' && (
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-red-600">Verification Failed</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {message}
                        </p>
                        <div className="mt-6">
                            <Link href="/auth/sign-in" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
