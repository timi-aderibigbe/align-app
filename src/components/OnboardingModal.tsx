import React, { useState } from 'react';
import { Modal } from './Modal';
import { Target, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../context/store';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const { updateSettings } = useStore();

    const handleNext = () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            // Complete
            updateSettings({ hasSeenOnboarding: true });
            onClose();
        }
    };

    const steps = [
        {
            title: "Welcome to Align",
            description: "Productivity isn't about doing more. It's about doing what matters. Align connects your daily tasks to your life's biggest dreams.",
            icon: <Target size={48} color="var(--color-primary)" />,
            color: "#e6f4ea"
        },
        {
            title: "The Hierarchy",
            description: "Start with a Vision (Long term). Break it into Goals (Quarterly). Then create Daily Tasks that move the needle.",
            icon: <Calendar size={48} color="#3498db" />,
            color: "#e8f6fd"
        },
        {
            title: "Daily Focus",
            description: "Every morning, pick 3 priorities. Link them to your goals. Build momentum one day at a time.",
            icon: <CheckCircle size={48} color="#2ecc71" />,
            color: "#eafaf1"
        }
    ];

    const currentStep = steps[step];

    return (
        <Modal isOpen={isOpen} onClose={() => { }} title="">
            <div className="onboarding-content">
                <div className="icon-wrapper" style={{ backgroundColor: currentStep.color }}>
                    {currentStep.icon}
                </div>

                <h2>{currentStep.title}</h2>
                <p>{currentStep.description}</p>

                <div className="dots">
                    {steps.map((_, i) => (
                        <div key={i} className={`dot ${i === step ? 'active' : ''}`} />
                    ))}
                </div>

                <button className="btn btn-primary btn-lg" onClick={handleNext}>
                    {step === 2 ? "Let's Go!" : "Next"} <ArrowRight size={18} />
                </button>
            </div>

            <style>{`
                .onboarding-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 20px 0;
                }
                .icon-wrapper {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                    transition: background-color 0.3s;
                }
                .onboarding-content h2 {
                    font-size: 1.8rem;
                    margin-bottom: 12px;
                    color: var(--color-text-main);
                }
                .onboarding-content p {
                    color: var(--color-text-secondary);
                    line-height: 1.6;
                    margin-bottom: 32px;
                    max-width: 300px;
                }
                .dots {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 32px;
                }
                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--color-border);
                    transition: all 0.3s;
                }
                .dot.active {
                    background: var(--color-primary);
                    width: 24px;
                    border-radius: 4px;
                }
                .btn-lg {
                    padding: 12px 48px;
                    font-size: 1.1rem;
                    border-radius: 50px;
                }
            `}</style>
        </Modal>
    );
};
