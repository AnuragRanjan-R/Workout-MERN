import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/user/verify-email/${token}`);
                const json = await response.json();

                if (!response.ok) {
                    setError(json.error);
                    toast.error(json.error);
                } else {
                    toast.success('Email verified successfully! You can now log in.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            } catch (error) {
                setError('An error occurred during verification');
                toast.error('An error occurred during verification');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="verify-email">
            <h3>Email Verification</h3>
            {isVerifying ? (
                <p>Verifying your email...</p>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <p>Email verified successfully! Redirecting to login...</p>
            )}
        </div>
    );
};

export default VerifyEmail; 