import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/user/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
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

                toast.success('Account created successfully! Please check your email for OTP.');
                navigate('/verify-otp', { state: { email } });
            }
        } catch (error) {
            setError('An error occurred during signup');
            toast.error('An error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form className="signup" onSubmit={handleSubmit}>
                <h3>Sign Up</h3>

                <label>Name:</label>
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    disabled={isLoading}
                    required
                />

                <label>Email:</label>
                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    disabled={isLoading}
                    required
                />

                <label>Password:</label>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    disabled={isLoading}
                    required
                />

                <button disabled={isLoading}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
                {error && <div className="error">{error}</div>}
            </form>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <span style={{ color: 'white' }}>Already have an account? <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer' }}>Log in</a></span>
            </div>
        </>
    );
};

export default Signup; 