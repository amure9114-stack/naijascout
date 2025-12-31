import { useState, useEffect } from 'react';
import { Shirt, Trophy, Footprints, FileText } from 'lucide-react';

export function FootballIdentityForm({ defaultValues, onSubmit, onBack }) {
    const [formData, setFormData] = useState(defaultValues || {});

    useEffect(() => {
        setFormData(defaultValues || {});
    }, [defaultValues]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const positions = [
        { value: 'goalkeeper', label: 'Goalkeeper (GK)' },
        { value: 'defender', label: 'Defender (DEF)' },
        { value: 'midfielder', label: 'Midfielder (MID)' },
        { value: 'forward', label: 'Forward (FW)' },
        { value: 'striker', label: 'Striker (ST)' }
    ];

    const feet = [
        { value: 'left', label: 'Left Foot' },
        { value: 'right', label: 'Right Foot' },
        { value: 'both', label: 'Both Feet' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass rounded-2xl p-8 border border-white/10 backdrop-blur-xl">
                <div className="mb-8">
                    <h2 className="font-display text-3xl font-bold mb-2">Football Identity</h2>
                    <p className="text-white/60">Share your football profile</p>
                </div>

                <div className="space-y-6">
                    {/* Position & Jersey */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <Shirt className="w-4 h-4 text-primary" />
                                Playing Position
                            </label>
                            <select
                                value={formData.position || ''}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:border-primary focus:bg-white/10 outline-none transition-all duration-200 appearance-none cursor-pointer"
                            >
                                <option value="">Select your position</option>
                                {positions.map(pos => (
                                    <option key={pos.value} value={pos.value}>{pos.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-3">Jersey Number</label>
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={formData.jerseyNumber || ''}
                                onChange={(e) => setFormData({ ...formData, jerseyNumber: e.target.value })}
                                placeholder="e.g. 7, 10"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Club & Preferred Foot */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <Trophy className="w-4 h-4 text-primary" />
                                Current Club
                            </label>
                            <input
                                type="text"
                                value={formData.club || ''}
                                onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                                placeholder="Manchester City, Ajax, etc."
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <Footprints className="w-4 h-4 text-primary" />
                                Preferred Foot
                            </label>
                            <select
                                value={formData.preferredFoot || ''}
                                onChange={(e) => setFormData({ ...formData, preferredFoot: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:border-primary focus:bg-white/10 outline-none transition-all duration-200 appearance-none cursor-pointer"
                            >
                                <option value="">Select preferred foot</option>
                                {feet.map(foot => (
                                    <option key={foot.value} value={foot.value}>{foot.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                            <FileText className="w-4 h-4 text-primary" />
                            Player Bio
                        </label>
                        <textarea
                            value={formData.bio || ''}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell scouts about your playing style, strengths, and career goals..."
                            rows={4}
                            maxLength={500}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200 resize-none"
                        />
                        <div className="mt-2 text-xs text-white/50">
                            {formData.bio?.length || 0}/500 characters
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
