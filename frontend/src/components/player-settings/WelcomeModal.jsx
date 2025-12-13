import { X, Sparkles, ArrowRight } from 'lucide-react';

export function WelcomeModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const steps = [
        {
            number: 1,
            title: 'Basic Information',
            description: 'Share your personal details',
            icon: '👤'
        },
        {
            number: 2,
            title: 'Football Identity',
            description: 'Your position, club & playing style',
            icon: '⚽'
        },
        {
            number: 3,
            title: 'Performance Stats',
            description: 'Goals, assists & overall rating',
            icon: '📊'
        },
        {
            number: 4,
            title: 'Media & Story',
            description: 'Highlights, photo & your journey',
            icon: '🎬'
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass rounded-3xl p-8 max-w-md w-full border border-white/10 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                        <h2 className="font-display text-3xl font-bold">Welcome!</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
                    >
                        <X className="w-5 h-5 text-white/60 hover:text-white" />
                    </button>
                </div>

                {/* Subtitle */}
                <p className="text-white/70 mb-8 leading-relaxed">
                    Let's complete your <span className="font-semibold text-primary">player profile</span>! Scouts use this to discover incredible talent like you.
                </p>

                {/* Steps Timeline */}
                <div className="space-y-4 mb-8">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex gap-4">
                            {/* Number Circle */}
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/30">
                                    {step.number}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="w-1 h-8 bg-gradient-to-b from-primary/60 to-transparent mt-2" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-2 pb-2">
                                <p className="font-semibold text-white text-sm">{step.icon} {step.title}</p>
                                <p className="text-xs text-white/60 mt-1">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Footer Note */}
                <p className="text-center text-xs text-white/50 mt-4">
                    Takes about 5 minutes • You can save progress
                </p>
            </div>
        </div>
    );
}
