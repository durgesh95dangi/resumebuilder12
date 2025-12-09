
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Plus, X } from 'lucide-react';

const step2Schema = z.object({
    summary: z.string().min(20, "Summary should be at least 20 characters"),
    skills: z.object({
        core: z.array(z.string()).min(1, "Add at least one core skill"),
        tools: z.array(z.string()),
        soft: z.array(z.string())
    })
});

type Step2Data = z.infer<typeof step2Schema>;

interface Step2Props {
    initialData: { summary: string; skills: { core: string[]; tools: string[]; soft: string[] } };
    onNext: (data: Step2Data) => void;
    onBack: () => void;
}

export function Step2SummarySkills({ initialData, onNext, onBack }: Step2Props) {
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            summary: initialData.summary || '',
            skills: {
                core: initialData.skills?.core || [],
                tools: initialData.skills?.tools || [],
                soft: initialData.skills?.soft || []
            }
        }
    });

    const SkillInput = ({ category, label, placeholder }: { category: 'core' | 'tools' | 'soft', label: string, placeholder: string }) => {
        const skills = watch(`skills.${category}`);

        const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = e.currentTarget.value.trim();
                if (val && !skills.includes(val)) {
                    setValue(`skills.${category}`, [...skills, val]);
                    e.currentTarget.value = '';
                }
            }
        };

        const removeSkill = (skillToRemove: string) => {
            setValue(`skills.${category}`, skills.filter(s => s !== skillToRemove));
        };

        return (
            <div className="space-y-2">
                <Label>{label}</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                        </span>
                    ))}
                </div>
                <Input
                    placeholder={placeholder}
                    onKeyDown={addSkill}
                    className="focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">Press Enter to add</p>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Summary & Skills</h2>
                <p className="text-gray-500 mt-1 pl-4">Highlight your expertise and professional background.</p>
            </div>

            {/* Professional Summary */}
            <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <span className="text-xs text-gray-400">2-3 sentences max</span>
                </div>
                <Textarea
                    id="summary"
                    {...register('summary')}
                    placeholder="Experienced [Role] with [Number] years of experience in..."
                    className="h-32"
                />
                {errors.summary && <p className="text-xs text-red-500">{errors.summary.message}</p>}

                {/* AI Suggestion Placeholder */}
                <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-md flex items-start gap-2">
                    <span className="text-lg">✨</span>
                    <div>
                        <p className="font-semibold">AI Tip:</p>
                        <p>Focus on your unique value proposition. Mention years of experience and key industries.</p>
                    </div>
                </div>
            </div>

            <div className="border-t pt-8 space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Skills</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SkillInput
                        category="core"
                        label="Core Competencies"
                        placeholder="e.g. Project Management, UI Design..."
                    />
                    <SkillInput
                        category="tools"
                        label="Tools & Technologies"
                        placeholder="e.g. Figma, React, Python..."
                    />
                    <SkillInput
                        category="soft"
                        label="Soft Skills (Optional)"
                        placeholder="e.g. Leadership, Communication..."
                    />
                </div>
                {errors.skills?.core && <p className="text-xs text-red-500">{errors.skills.core.message}</p>}
            </div>

            <div className="flex justify-between pt-6 border-t mt-6">
                <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8">
                    Next: Work Experience
                </Button>
            </div>
        </form>
    );
}
