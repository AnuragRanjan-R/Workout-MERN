import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
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

                toast.success('Logged in successfully!');
                navigate('/');
            }
        } catch (error) {
            setError('An error occurred during login');
            toast.error('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="login" onSubmit={handleSubmit}>
            <h3>Log In</h3>

            <label>Email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={isLoading}
            />

            <label>Password:</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={isLoading}
            />

            <button disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
            </button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default Login; 