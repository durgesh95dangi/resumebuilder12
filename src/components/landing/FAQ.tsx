
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "Is this resume builder really free?",
        answer: "Yes! We offer a Free tier that allows you to create and download a professional resume. For advanced features like AI writing assistance and unlimited downloads, we offer affordable Pro upgrades."
    },
    {
        question: "Are the templates ATS-friendly?",
        answer: "Absolutely. All our templates are designed specifically to be readable by Applicant Tracking Systems (ATS), ensuring your resume gets past the bots and reaches human recruiters."
    },
    {
        question: "Can I download my resume in PDF?",
        answer: "Yes, you can download your resume in PDF format, which is the industry standard for job applications. The Pro plan allows unlimited PDF downloads."
    },
    {
        question: "How does the AI writing assistant work?",
        answer: "Our AI helps you phrase your experience and skills more professionally. Just provide a brief description, and it will generate polished, action-oriented bullet points for you."
    },
    {
        question: "Can I create multiple versions of my resume?",
        answer: "Yes! You can create different versions of your resume tailored to specific job applications. Our Pro plan supports managing multiple resume profiles."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-display"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <p className="text-lg text-gray-600 font-sans">
                        Everything you need to know about ResumeBuilder.
                    </p>
                </div>

                <div className="space-y-4 font-sans">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
