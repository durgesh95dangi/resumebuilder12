
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

const achievementSchema = z.object({
    id: z.string(),
    text: z.string().min(5, "Achievement is too short")
});

const jobSchema = z.object({
    id: z.string(),
    title: z.string().min(2, "Job title is required"),
    company: z.string().min(2, "Company is required"),
    location: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean(),
    summary: z.string().optional(), // 1-line role summary
    achievements: z.array(achievementSchema).min(1, "Add at least one achievement")
});

const step3Schema = z.object({
    experience: z.array(jobSchema)
});

type Step3Data = z.infer<typeof step3Schema>;

interface Step3Props {
    initialData: any[];
    onNext: (data: any) => void;
    onBack: () => void;
}

export function Step3Experience({ initialData, onNext, onBack }: Step3Props) {
    const [editingId, setEditingId] = useState<string | null>(null);

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Step3Data>({
        resolver: zodResolver(step3Schema),
        defaultValues: {
            experience: initialData?.length ? initialData : []
        }
    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "experience"
    });

    // Sub-form for adding a new job
    const [newJob, setNewJob] = useState({
        id: crypto.randomUUID(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        summary: '',
        achievements: [] as { id: string, text: string }[]
    });

    const [bulletText, setBulletText] = useState('');

    const addBullet = () => {
        if (!bulletText.trim()) return;
        setNewJob(prev => ({
            ...prev,
            achievements: [...prev.achievements, { id: crypto.randomUUID(), text: bulletText }]
        }));
        setBulletText('');
    };

    const saveJob = () => {
        if (!newJob.title || !newJob.company) return;

        append(newJob);
        // Reset
        setNewJob({
            id: crypto.randomUUID(),
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            summary: '',
            achievements: []
        });
        setEditingId(null);
    };

    const deleteJob = (index: number) => {
        remove(index);
    };

    return (
        <div className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Work Experience</h2>
                <p className="text-gray-500 mt-1 pl-4">Add your relevant work history. Focus on achievements with metrics.</p>
            </div>

            {/* List of added jobs */}
            <div className="space-y-4">
                {fields.map((job, index) => (
                    <div key={job.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-start group hover:border-blue-200 transition-colors">
                        <div>
                            <h3 className="font-bold text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.company} • {job.startDate} - {job.current ? 'Present' : job.endDate}</p>
                            <ul className="mt-2 list-disc list-inside text-xs text-gray-500">
                                {job.achievements.slice(0, 2).map((a: any) => (
                                    <li key={a.id} className="truncate max-w-md">{a.text}</li>
                                ))}
                                {job.achievements.length > 2 && <li>+ {job.achievements.length - 2} more bullets</li>}
                            </ul>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteJob(index)} className="text-red-500 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Add New Job Form */}
            <div className="border-t pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                            value={newJob.title}
                            onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                            placeholder="e.g. Product Manager"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                            value={newJob.company}
                            onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                            placeholder="e.g. Acme Corp"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                            value={newJob.location}
                            onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                            placeholder="City, Country"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Role Summary (1 line)</Label>
                        <Input
                            value={newJob.summary}
                            onChange={e => setNewJob({ ...newJob, summary: e.target.value })}
                            placeholder="Led cross-functional team..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                            type="month"
                            value={newJob.startDate}
                            onChange={e => setNewJob({ ...newJob, startDate: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>End Date</Label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="month"
                                value={newJob.endDate}
                                onChange={e => setNewJob({ ...newJob, endDate: e.target.value })}
                                disabled={newJob.current}
                            />
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <Checkbox
                                    id="current"
                                    checked={newJob.current}
                                    onChange={(e) => setNewJob({ ...newJob, current: e.target.checked })}
                                />
                                <Label htmlFor="current" className="mb-0">Current</Label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bullets Section */}
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <Label className="text-blue-900">Key Achievements (Bullet Points)</Label>
                    <p className="text-xs text-blue-700 mb-4">Add 3-6 bullets. Focus on metrics (e.g., "Increased sales by 20%").</p>

                    <div className="space-y-2 mb-4">
                        {newJob.achievements.map((bullet, idx) => (
                            <div key={bullet.id} className="bg-white p-2 rounded border border-blue-100 flex justify-between items-center text-sm">
                                <span>• {bullet.text}</span>
                                <button
                                    onClick={() => setNewJob(prev => ({ ...prev, achievements: prev.achievements.filter(b => b.id !== bullet.id) }))}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Input
                            value={bulletText}
                            onChange={e => setBulletText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addBullet()}
                            placeholder="Type an achievement and press Enter..."
                            className="bg-white"
                        />
                        <Button type="button" onClick={addBullet} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Add
                        </Button>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={saveJob}
                    className="w-full bg-gray-900 text-white hover:bg-gray-800"
                    disabled={!newJob.title || !newJob.company || newJob.achievements.length === 0}
                >
                    <Plus className="w-4 h-4 mr-2" /> Save This Job
                </Button>
            </div>

            <div className="flex justify-between pt-6 border-t mt-6">
                <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
                <Button
                    onClick={() => handleSubmit(onNext)()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
                >
                    Next: Education
                </Button>
            </div>
        </div>
    );
}
import { X } from 'lucide-react';
