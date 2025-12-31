import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

    // Load data from localStorage and hydrate from backend if authenticated
    useEffect(() => {
        const saved = localStorage.getItem('playerSettings');
        let savedData = null;
        if (saved) {
            try {
                savedData = JSON.parse(saved);
                setFormData(savedData);
                setIsFirstTime(false);
            } catch (err) {
                console.error('Failed to load saved data:', err);
            }
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/players/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) {
                    if (res.status !== 404) {
                        console.warn('Failed to fetch profile from backend', await res.text());
                    }
                    return;
                }

                const payload = await res.json();
                const profile = payload?.data || {};
                const merged = { ...profile, ...(savedData || {}) };
                setFormData(merged);
                if (Object.keys(profile).length) {
                    setIsFirstTime(false);
                }
            } catch (err) {
                console.warn('Failed to hydrate profile from backend', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
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

            const responseBody = await res.json().catch(() => null);
            const persisted = responseBody?.data || formData;

            // Save to localStorage as backup
            localStorage.setItem('playerSettings', JSON.stringify(persisted));
            setFormData(persisted);
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
