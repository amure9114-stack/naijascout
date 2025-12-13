import { CheckCircle2, Circle, Zap, Trophy } from 'lucide-react';

export function ProfileCompleteness({ percentage, breakdown, tips }) {
    const getCompletionColor = () => {
        if (!percentage) return 'from-orange-500 to-yellow-500';
        if (percentage < 50) return 'from-yellow-500 to-orange-500';
        if (percentage < 80) return 'from-blue-500 to-cyan-500';
        return 'from-emerald-500 to-green-500';
    };

    const getCompletionMessage = () => {
        if (!percentage) return 'Just getting started!';
        if (percentage < 50) return 'You\'re on your way!';
        if (percentage < 80) return 'Almost there!';
        if (percentage < 100) return 'One final push!';
        return 'All set! 🎉';
    };

    return (
        <div className="glass rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-bold">Profile Strength</h3>
            </div>

            {/* Percentage Display */}
            <div className="mb-6">
                <div className="flex items-end justify-between mb-3">
                    <div>
                        <p className={`text-4xl font-black bg-gradient-to-r ${getCompletionColor()} bg-clip-text text-transparent`}>
                            {percentage || 0}%
                        </p>
                        <p className="text-xs text-white/60 mt-1">{getCompletionMessage()}</p>
                    </div>
                    <span className="text-2xl">
                        {!percentage && '📝'}
                        {percentage && percentage < 50 && '🚀'}
                        {percentage && percentage >= 50 && percentage < 80 && '⭐'}
                        {percentage && percentage >= 80 && percentage < 100 && '🔥'}
                        {percentage === 100 && '✨'}
                    </span>
                </div>

                {/* Main Progress Bar */}
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
                    <div
                        className={`h-full bg-gradient-to-r ${getCompletionColor()} transition-all duration-500 shadow-lg shadow-primary/20 rounded-full`}
                        style={{ width: `${percentage || 0}%` }}
                    />
                </div>
            </div>

            {/* Breakdown Sections */}
            {breakdown && breakdown.length > 0 && (
                <div className="space-y-2 mb-6 pb-6 border-b border-white/10">
                    <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">Completion Status</p>
                    {breakdown.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                            {item.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            ) : (
                                <Circle className="w-5 h-5 text-white/30 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${item.completed ? 'text-white/80 font-medium' : 'text-white/50'}`}>
                                {item.label}
                            </span>
                            {item.completed && <span className="ml-auto text-xs text-emerald-500">✓</span>}
                        </div>
                    ))}
                </div>
            )}

            {/* Tips Section */}
            {tips && tips.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Pro Tips</p>
                    </div>
                    <div className="space-y-2">
                        {tips.map((tip, index) => (
                            <div key={index} className="flex gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                                <span className="text-primary font-bold text-xs mt-0.5">→</span>
                                <span className="text-xs text-white/70 leading-relaxed">{tip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
