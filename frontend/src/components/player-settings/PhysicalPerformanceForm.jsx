import { useState } from 'react';
import { Zap, Target, Activity, TrendingUp } from 'lucide-react';

export function PhysicalPerformanceForm({ defaultValues, onSubmit, onBack }) {
    const [formData, setFormData] = useState(defaultValues || {});

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass rounded-2xl p-8 border border-white/10 backdrop-blur-xl">
                <div className="mb-8">
                    <h2 className="font-display text-3xl font-bold mb-2">Physical Performance</h2>
                    <p className="text-white/60">Your statistics and potential</p>
                </div>

                <div className="space-y-6">
                    {/* Physical Attributes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <Activity className="w-4 h-4 text-primary" />
                                Height (cm)
                            </label>
                            <input
                                type="number"
                                min="140"
                                max="220"
                                value={formData.height || ''}
                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                placeholder="180"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-3">Weight (kg)</label>
                            <input
                                type="number"
                                min="50"
                                max="150"
                                value={formData.weight || ''}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                placeholder="75"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Ratings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <Zap className="w-4 h-4 text-primary" />
                                Overall Rating
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    min="0"
                                    max="99"
                                    value={formData.overallRating || ''}
                                    onChange={(e) => setFormData({ ...formData, overallRating: e.target.value })}
                                    placeholder="82"
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                                />
                                <span className="text-white/60 font-semibold min-w-12">/99</span>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                Potential
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    min="0"
                                    max="99"
                                    value={formData.potential || ''}
                                    onChange={(e) => setFormData({ ...formData, potential: e.target.value })}
                                    placeholder="88"
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                                />
                                <span className="text-white/60 font-semibold min-w-12">/99</span>
                            </div>
                        </div>
                    </div>

                    {/* Career Stats */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            Career Statistics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-3">Goals</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.goals || ''}
                                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                    placeholder="12"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-3">Assists</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.assists || ''}
                                    onChange={(e) => setFormData({ ...formData, assists: e.target.value })}
                                    placeholder="5"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-3">Matches Played</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.matches || ''}
                                    onChange={(e) => setFormData({ ...formData, matches: e.target.value })}
                                    placeholder="45"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-8 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </form>
    );
}
