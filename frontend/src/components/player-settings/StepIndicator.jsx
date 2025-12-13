import { Check } from 'lucide-react';

export function StepIndicator({ currentStep, onStepClick }) {
    const steps = [
        { number: 1, label: 'Basic Info', icon: '👤' },
        { number: 2, label: 'Football Identity', icon: '⚽' },
        { number: 3, label: 'Performance', icon: '📊' },
        { number: 4, label: 'Media & Story', icon: '🎬' },
    ];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => onStepClick(index)}
                                disabled={currentStep < index}
                                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 mb-3 ${currentStep === index
                                        ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-110'
                                        : currentStep > index
                                            ? 'bg-primary/20 text-primary border-2 border-primary'
                                            : 'bg-white/5 border-2 border-white/20 text-white/50 cursor-not-allowed'
                                    }`}
                            >
                                {currentStep > index ? <Check className="w-6 h-6" /> : step.number}
                            </button>
                            <div className="text-center">
                                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">{step.label}</p>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`h-1 flex-1 mx-3 rounded-full transition-all duration-300 ${currentStep > index
                                        ? 'bg-gradient-to-r from-primary to-primary/60'
                                        : 'bg-white/10'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
            </div>
        </div>
    );
}
