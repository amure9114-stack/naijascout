import { useState, useEffect } from 'react';

export function usePlayerSettings() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [completeness, setCompleteness] = useState({
        percentage: 0,
        breakdown: [],
        tips: []
    });

    // Load data from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('playerSettings');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setFormData(data);
                setIsFirstTime(false);
            } catch (err) {
                console.error('Failed to load saved data:', err);
            }
        }
    }, []);

    // Calculate profile completeness
    useEffect(() => {
        const fields = Object.values(formData).filter(v => v && v !== '');
        const percentage = Math.round((fields.length / 15) * 100);

        setCompleteness({
            percentage: Math.min(percentage, 100),
            breakdown: [
                { label: 'Basic Info', completed: !!formData.firstName && !!formData.lastName },
                { label: 'Football Identity', completed: !!formData.position && !!formData.club },
                { label: 'Physical Stats', completed: !!formData.height && !!formData.weight },
                { label: 'Media & Story', completed: !!formData.bio && !!formData.story }
            ],
            tips: [
                'Add a profile picture to stand out',
                'Include your video highlights',
                'Write a compelling bio',
                'Keep stats updated'
            ]
        });
    }, [formData]);

    const updateFormData = (data) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const saveDraft = async () => {
        setIsSaving(true);
        try {
            localStorage.setItem('playerSettings', JSON.stringify(formData));
            setLastSaved(new Date());

            // Try to save to backend if authenticated
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    // Use /me endpoint for better security
                    await fetch(`${API_URL}/api/players/me`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(formData)
                    });
                } catch (err) {
                    console.warn('Failed to persist draft to backend', err);
                }
            }
        } catch (err) {
            console.error('Failed to save:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const submitProfile = async () => {
        setIsLoading(true);
        try {
            // Call backend API to submit the complete profile
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            // Use /me endpoint for better security (no username in URL)
            const res = await fetch(`${API_URL}/api/players/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Save failed: ${errText}`);
            }

            // Save to localStorage as backup
            localStorage.setItem('playerSettings', JSON.stringify(formData));
            setLastSaved(new Date());

            // Reset first time flag
            setIsFirstTime(false);

            // Show success (in a real app, you'd show a toast)
            console.log('Profile submitted successfully');
        } catch (err) {
            console.error('Failed to submit profile:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const calculateAge = (dateString) => {
        if (!dateString) return null;
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return {
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
        setIsFirstTime
    };
}
