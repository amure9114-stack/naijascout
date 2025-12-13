import { useState } from 'react';
import { User, Mail, Calendar } from 'lucide-react';

export function BasicInfoForm({ defaultValues, onSubmit, calculateAge }) {
    const [formData, setFormData] = useState(defaultValues || {});

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setFormData({
            ...formData,
            dateOfBirth: date,
            age: calculateAge(date)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass rounded-2xl p-8 border border-white/10 backdrop-blur-xl">
                <div className="mb-8">
                    <h2 className="font-display text-3xl font-bold mb-2">Basic Information</h2>
                    <p className="text-white/60">Tell us about yourself</p>
                </div>

                <div className="space-y-6">
                    {/* Name Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <User className="w-4 h-4 text-primary" />
                                First Name
                            </label>
                            <input
                                type="text"
                                value={formData.firstName || ''}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="Emmanuel"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-3">Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName || ''}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Blacko"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Date of Birth & Age */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <Calendar className="w-4 h-4 text-primary" />
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={formData.dateOfBirth || ''}
                                onChange={handleDateChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:border-primary focus:bg-white/10 outline-none transition-all duration-200 [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-3">Age</label>
                            <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white/70 flex items-center">
                                {formData.age ? `${formData.age} years old` : 'Select date of birth'}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                                <Mail className="w-4 h-4 text-primary" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-3">Nationality</label>
                            <input
                                type="text"
                                value={formData.nationality || ''}
                                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                placeholder="Nigeria"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+234 (701) 234-5678"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-8 border-t border-white/10">
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
