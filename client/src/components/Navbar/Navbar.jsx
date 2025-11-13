import './Navbar.css';
import { Link } from 'react-router-dom';
import bearIcon from '../../assets/walking-bear-thumbnail.png';

const Navbar = () => {
    return (
        <nav id="navbar">
            <div className="navbar-left">
                <Link to="/" id="home">
                    <img src = {bearIcon} alt="Berkeley Logo" id="bear-icon"/>
                    <span id="site-title">r/berkeley · Live Analytics</span>
                </Link>
            </div>
            <ul id = "navbar-right">
                <li><Link to="/weekly-digest" className="nav-link">Weekly Digest</Link></li>
                <li><Link to="/food-spots" className="nav-link">Food Spots</Link></li>
                <li><Link to="/trends" className="nav-link">Trends</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;