
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

const educationSchema = z.object({
    id: z.string(),
    institution: z.string().min(2, "Institution is required"),
    degree: z.string().min(2, "Degree is required"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    notes: z.string().optional(), // e.g. GPA, Honors
});

const certificationSchema = z.object({
    id: z.string(),
    name: z.string().min(2, "Name is required"),
    issuer: z.string().min(2, "Issuer is required"),
    date: z.string().optional(),
});

const step4Schema = z.object({
    education: z.array(educationSchema),
    certifications: z.array(certificationSchema)
});

type Step4Data = z.infer<typeof step4Schema>;

interface Step4Props {
    initialData: { education: any[]; certifications: any[] };
    onNext: (data: any) => void;
    onBack: () => void;
}

export function Step4Education({ initialData, onNext, onBack }: Step4Props) {
    const { register, control, handleSubmit, formState: { errors } } = useForm<Step4Data>({
        resolver: zodResolver(step4Schema),
        defaultValues: {
            education: initialData.education || [],
            certifications: initialData.certifications || []
        }
    });

    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
        control,
        name: "education"
    });

    const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
        control,
        name: "certifications"
    });

    const addEducation = () => {
        appendEdu({
            id: crypto.randomUUID(),
            institution: '',
            degree: '',
            startDate: '',
            endDate: '',
            notes: ''
        });
    };

    const addCertification = () => {
        appendCert({
            id: crypto.randomUUID(),
            name: '',
            issuer: '',
            date: ''
        });
    };

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Education & Certifications</h2>
                <p className="text-gray-500 mt-1 pl-4">Add your academic background and professional credentials.</p>
            </div>

            {/* Education Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Education</h3>

                {eduFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg bg-gray-50 relative space-y-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEdu(index)}
                            className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>School / University</Label>
                                <Input {...register(`education.${index}.institution`)} placeholder="e.g. Harvard University" className={errors.education?.[index]?.institution ? 'border-red-500' : ''} />
                            </div>
                            <div className="space-y-2">
                                <Label>Degree / Major</Label>
                                <Input {...register(`education.${index}.degree`)} placeholder="e.g. BS Computer Science" className={errors.education?.[index]?.degree ? 'border-red-500' : ''} />
                            </div>
                            <div className="space-y-2">
                                <Label>Start Year</Label>
                                <Input {...register(`education.${index}.startDate`)} placeholder="e.g. 2018" />
                            </div>
                            <div className="space-y-2">
                                <Label>End Year (or Expected)</Label>
                                <Input {...register(`education.${index}.endDate`)} placeholder="e.g. 2022" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label>Notes (Optional)</Label>
                                <Input {...register(`education.${index}.notes`)} placeholder="e.g. Graduated Cum Laude, GPA 3.8" />
                            </div>
                        </div>
                    </div>
                ))}

                <Button type="button" onClick={addEducation} variant="secondary" className="w-full border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600">
                    <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
            </div>

            {/* Certifications Section */}
            <div className="space-y-6 border-t pt-8">
                <h3 className="text-lg font-bold text-gray-900">Certifications (Optional)</h3>

                {certFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg bg-gray-50 relative space-y-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCert(index)}
                            className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Certification Name</Label>
                                <Input {...register(`certifications.${index}.name`)} placeholder="e.g. AWS Solutions Architect" className={errors.certifications?.[index]?.name ? 'border-red-500' : ''} />
                            </div>
                            <div className="space-y-2">
                                <Label>Issuing Organization</Label>
                                <Input {...register(`certifications.${index}.issuer`)} placeholder="e.g. Amazon Web Services" className={errors.certifications?.[index]?.issuer ? 'border-red-500' : ''} />
                            </div>
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input {...register(`certifications.${index}.date`)} placeholder="e.g. May 2023" />
                            </div>
                        </div>
                    </div>
                ))}

                <Button type="button" onClick={addCertification} variant="secondary" className="w-full border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600">
                    <Plus className="w-4 h-4 mr-2" /> Add Certification
                </Button>
            </div>

            <div className="flex justify-between pt-6 border-t mt-6">
                <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8">
                    Next: Projects & Preview
                </Button>
            </div>
        </form>
    );
}
