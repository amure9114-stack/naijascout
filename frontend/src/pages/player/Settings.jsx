import { useEffect, useState } from "react";
import { Save, Clock } from "lucide-react";
import { StepIndicator } from "@/components/player-settings/StepIndicator";
import { ProfileCompleteness } from "@/components/player-settings/ProfileCompleteness";
import { BasicInfoForm } from "@/components/player-settings/BasicInfoForm";
import { FootballIdentityForm } from "@/components/player-settings/FootballIdentityForm";
import { PhysicalPerformanceForm } from "@/components/player-settings/PhysicalPerformanceForm";
import { MediaStoryForm } from "@/components/player-settings/MediaStoryForm";
import { WelcomeModal } from "@/components/player-settings/WelcomeModal";
import { usePlayerSettings } from "@/hooks/usePlayerSettings";

export default function PlayerSettings() {
    const {
        currentStep,
        formData,
        isLoading,
        isSaving,
        lastSaved,
        isFirstTime,
        completeness,
        setCurrentStep,
        updateFormData,
        nextStep,
        prevStep,
        saveDraft,
        submitProfile,
        calculateAge,
        setIsFirstTime,
    } = usePlayerSettings();

    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        if (isFirstTime) {
            setShowWelcome(true);
        }
    }, [isFirstTime]);

    const handleWelcomeClose = () => {
        setShowWelcome(false);
        setIsFirstTime(false);
    };

    const formatLastSaved = (date) => {
        if (!date) return null;
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Just now";
        if (diffMins === 1) return "1 minute ago";
        if (diffMins < 60) return `${diffMins} minutes ago`;
        return date.toLocaleTimeString();
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <BasicInfoForm
                        defaultValues={formData}
                        onSubmit={(data) => {
                            updateFormData(data);
                            nextStep();
                        }}
                        calculateAge={calculateAge}
                    />
                );
            case 1:
                return (
                    <FootballIdentityForm
                        defaultValues={formData}
                        onSubmit={(data) => {
                            updateFormData(data);
                            nextStep();
                        }}
                        onBack={prevStep}
                    />
                );
            case 2:
                return (
                    <PhysicalPerformanceForm
                        defaultValues={formData}
                        onSubmit={(data) => {
                            updateFormData(data);
                            nextStep();
                        }}
                        onBack={prevStep}
                    />
                );
            case 3:
                return (
                    <MediaStoryForm
                        defaultValues={formData}
                        onSubmit={async (data) => {
                            updateFormData(data);
                            await submitProfile();
                        }}
                        onBack={prevStep}
                        isLoading={isLoading}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
                <div className="container flex items-center justify-between h-16 px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-display text-lg">NS</span>
                        </div>
                        <div>
                            <h1 className="font-display text-xl">NAIJASCOUT</h1>
                            <p className="text-xs text-muted-foreground">Player Settings</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {lastSaved && (
                            <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                Saved {formatLastSaved(lastSaved)}
                            </span>
                        )}
                        <button
                            onClick={saveDraft}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            <span className="hidden sm:inline">Save Progress</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="container px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Step Indicator */}
                    <div className="mb-8">
                        <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form Area */}
                        <div className="lg:col-span-2">
                            <div className="form-section">{renderCurrentStep()}</div>
                        </div>

                        {/* Sidebar - Profile Completeness */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-24">
                                <ProfileCompleteness
                                    percentage={completeness.percentage}
                                    breakdown={completeness.breakdown}
                                    tips={completeness.tips}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Welcome Modal */}
            <WelcomeModal isOpen={showWelcome} onClose={handleWelcomeClose} />
        </div>
    );
}
