import { useState, useEffect } from 'react';
import { Upload, Video, FileText, Check } from 'lucide-react';

export function MediaStoryForm({ defaultValues, onSubmit, onBack, isLoading }) {
    const [formData, setFormData] = useState(defaultValues || {});
    const [previewImage, setPreviewImage] = useState(null);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        setFormData(defaultValues || {});
        if (defaultValues?.profilePicture) {
            setPreviewImage(defaultValues.profilePicture);
        }
    }, [defaultValues]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate profile picture is required
        if (!formData.profilePicture && !previewImage) {
            setValidationError('Profile picture is required. This will be shown in the player pool and as your profile image.');
            return;
        }

        setValidationError('');
        onSubmit(formData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result;
                setPreviewImage(dataUrl || null);
                if (dataUrl) {
                    // Persist the image as a base64 data URL so it can be sent via JSON to the API
                    setFormData((prev) => ({ ...prev, profilePicture: dataUrl }));
                    // Clear validation error when picture is added
                    setValidationError('');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass rounded-2xl p-8 border border-white/10 backdrop-blur-xl">
                <div className="mb-8">
                    <h2 className="font-display text-3xl font-bold mb-2">Final Touch: Your Media & Story</h2>
                    <p className="text-white/60">Complete your profile and captivate scouts</p>
                </div>

                <div className="space-y-8">
                    {/* Profile Picture Upload */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-4">
                            <Upload className="w-4 h-4 text-primary" />
                            Profile Picture <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                id="profilePic"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="profilePic"
                                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer hover:border-primary/60 hover:bg-white/5 transition-all duration-200 ${validationError ? 'border-destructive/60 bg-destructive/5' : 'border-white/30'}`}
                            >
                                {previewImage ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <img src={previewImage} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
                                        <span className="text-sm text-primary font-semibold">Click to change</span>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-12 h-12 mx-auto mb-3 text-white/40" />
                                        <p className="text-sm font-medium text-white/70">Drag and drop your photo</p>
                                        <p className="text-xs text-white/50 mt-1">or click to browse</p>
                                        <p className="text-xs text-white/40 mt-2">PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {validationError && (
                            <p className="text-destructive text-sm mt-2">{validationError}</p>
                        )}
                        <p className="text-xs text-white/50 mt-2">Required — This will be your profile picture in the player pool</p>
                    </div>

                    {/* Video Highlights */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-4">
                            <Video className="w-4 h-4 text-primary" />
                            Video Highlights Link
                        </label>
                        <input
                            type="url"
                            value={formData.highlightsLink || ''}
                            onChange={(e) => setFormData({ ...formData, highlightsLink: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200"
                        />
                        <p className="text-xs text-white/50 mt-2">Share your best highlights or match videos</p>
                    </div>

                    {/* Your Story */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-4">
                            <FileText className="w-4 h-4 text-primary" />
                            Your Story
                        </label>
                        <textarea
                            value={formData.story || ''}
                            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                            placeholder="Tell scouts about your journey, biggest achievements, playing style, and what drives you as a player..."
                            maxLength={1000}
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:bg-white/10 outline-none transition-all duration-200 resize-none"
                        />
                        <div className="mt-2 text-xs text-white/50">
                            {formData.story?.length || 0}/1000 characters
                        </div>
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={formData.agreeToTerms || false}
                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                            className="w-5 h-5 mt-0.5 accent-primary cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-sm text-white/80 cursor-pointer">
                            I agree that the information I've provided is accurate and that I'm authorized to share these details with NaijaScout and potential scouts.
                        </label>
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
                        disabled={isLoading || !formData.agreeToTerms || (!formData.profilePicture && !previewImage)}
                        className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        {isLoading ? 'Completing...' : 'Complete Profile'}
                    </button>
                </div>
            </div>
        </form>
    );
}
