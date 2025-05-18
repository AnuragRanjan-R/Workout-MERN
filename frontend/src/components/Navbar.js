import { Link } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
    const { user, dispatch } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>Workout Buddy</h1>
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.email}</span>
                            <button onClick={handleLogout}>Log out</button>
                        </div>
                    )}
                    {!user && (
                        <div>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;