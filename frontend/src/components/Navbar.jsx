import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardPath } from '../utils/roles';

const MENU = {
    USER: ['Browse Spots', 'Saved Spots'],
    OWNER: ['My Business Listing', 'Verification Status', 'Analytics'],
    ADMIN: ['Verification Queue', 'Flagged Content', 'Manage Users'],
};

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <span className="brand">TuckedinPlace</span>
            <Link to={dashboardPath(user.role)}>Dashboard</Link>
            {MENU[user.role].map((item) => (
                <span key={item} className="nav-item disabled" title="Coming in the next increment">
          {item}
        </span>
            ))}
            <Link to="/profile">My Profile</Link>
            <Link to="/change-password">Change Password</Link>
            <span className="spacer" />
            <span className="badge">{user.role}</span>
            <span>{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
}