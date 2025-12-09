
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';

const personalSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    title: z.string().min(2, "Professional title is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(5, "Phone is required"),
    location: z.string().optional(),
    linkedin: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
});

type PersonalData = z.infer<typeof personalSchema>;

interface Step1Props {
    initialData: PersonalData;
    onNext: (data: PersonalData) => void;
}

export function Step1Personal({ initialData, onNext }: Step1Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<PersonalData>({
        resolver: zodResolver(personalSchema),
        defaultValues: initialData,
    });

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Personal Details</h2>
                <p className="text-gray-500 mt-1 pl-4">Start with the basics. This information appears at the top of your resume.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" {...register('fullName')} error={!!errors.fullName} placeholder="e.g. John Doe" />
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                </div>

                {/* Professional Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" {...register('title')} error={!!errors.title} placeholder="e.g. Senior Software Engineer" />
                    {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} error={!!errors.email} placeholder="john@example.com" />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register('phone')} error={!!errors.phone} placeholder="+1 234 567 890" />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input id="location" {...register('location')} error={!!errors.location} placeholder="City, Country" />
                </div>

                {/* Empty spacer for grid alignment */}
                <div className="hidden md:block"></div>

                {/* LinkedIn */}
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
                    <Input id="linkedin" {...register('linkedin')} error={!!errors.linkedin} placeholder="https://linkedin.com/in/..." />
                    {errors.linkedin && <p className="text-xs text-red-500">{errors.linkedin.message}</p>}
                </div>

                {/* Portfolio */}
                <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL (Optional)</Label>
                    <Input id="portfolio" {...register('portfolio')} error={!!errors.portfolio} placeholder="https://myportfolio.com" />
                    {errors.portfolio && <p className="text-xs text-red-500">{errors.portfolio.message}</p>}
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t mt-6">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8">
                    Next: Summary & Skills
                </Button>
            </div>
        </form>
    );
}
