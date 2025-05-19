import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();
    const email = location.state?.email;

    if (!email) {
        navigate('/signup');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/user/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
                toast.error(json.error);
            }

            if (response.ok) {
                // save the user to local storage
                localStorage.setItem('user', JSON.stringify(json));

                // update the auth context
                dispatch({ type: 'LOGIN', payload: json });

                toast.success('Email verified successfully!');
                navigate('/');
            }
        } catch (error) {
            setError('An error occurred during verification');
            toast.error('An error occurred during verification');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/user/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const json = await response.json();

            if (!response.ok) {
                toast.error(json.error);
            } else {
                toast.success('New OTP sent successfully!');
            }
        } catch (error) {
            toast.error('Failed to resend OTP');
        }
    };

    return (
        <div className="verify-otp">
            <form onSubmit={handleSubmit}>
                <h3>Verify Your Email</h3>
                <p>Please enter the OTP sent to your email address.</p>

                <label>OTP:</label>
                <input
                    type="text"
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    disabled={isLoading}
                    required
                    maxLength="6"
                    pattern="[0-9]{6}"
                    title="Please enter a 6-digit OTP"
                />

                <button disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button 
                    type="button" 
                    onClick={handleResendOTP}
                    className="resend-button"
                    disabled={isLoading}
                >
                    Resend OTP
                </button>

                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
};

export default VerifyOTP; 