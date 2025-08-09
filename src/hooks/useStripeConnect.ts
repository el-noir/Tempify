import { useState, useEffect } from 'react';
import axios from 'axios';

interface StripeConnectStatus {
    accountId?: string;
    status?: 'pending' | 'active' | 'rejected' | 'restricted';
    onboardingComplete?: boolean;
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
    requirements?: any;
}

export function useStripeConnect() {
    const [status, setStatus] = useState<StripeConnectStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAccount = async (country: string = 'US') => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/stripe/connect/create-account', {
                country
            });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createOnboardingLink = async (returnUrl: string, refreshUrl: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/stripe/connect/onboard', {
                returnUrl,
                refreshUrl
            });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create onboarding link');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const checkStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/stripe/connect/status');
            setStatus(response.data);
            return response.data;
        } catch (err: any) {
            if (err.response?.status !== 404) {
                setError(err.response?.data?.message || 'Failed to check status');
            }
            setStatus(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    return {
        status,
        loading,
        error,
        createAccount,
        createOnboardingLink,
        checkStatus,
        refreshStatus: checkStatus
    };
}
