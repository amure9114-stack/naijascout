import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUserTie, FaUsers, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useEffect, useRef } from 'react';

export default function ScoutBottomNav() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const navRef = useRef(null);

    const items = [
        { name: 'Home', path: '/scout/profile', icon: <FaHome /> },
        { name: 'Players', path: '/scout/players', icon: <FaUsers /> },
        { name: 'Reports', path: '/scout/reports', icon: <FaUserTie /> },
        { name: 'Analytics', path: '/scout/analytics', icon: <FaChartBar /> },
        { name: 'Settings', path: '/scout/settings', icon: <FaCog /> },
        { name: 'Logout', path: '/auth', icon: <FaSignOutAlt /> },
    ];

    useEffect(() => {
        const root = navRef.current;
        if (!root) return;
        const handleKey = (e) => {
            const focusable = Array.from(root.querySelectorAll('a,button')).filter(el => !el.hasAttribute('disabled'));
            const idx = focusable.indexOf(document.activeElement);
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const next = focusable[(idx + 1) % focusable.length];
                next?.focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prev = focusable[(idx - 1 + focusable.length) % focusable.length];
                prev?.focus();
            }
        };
        root.addEventListener('keydown', handleKey);
        return () => root.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <nav ref={navRef} role="navigation" aria-label="Scout quick navigation" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-md rounded-2xl px-3 py-2 shadow-lg border border-white/10 max-w-md w-full mx-4 sm:mx-auto">
            <ul className="flex justify-between items-center" role="menubar">
                {items.map((it) => {
                    const active = pathname === it.path;
                    const sharedClasses = `flex flex-col items-center text-xs sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 px-2 py-1 rounded-md ${active ? 'text-green-400' : 'text-white/80'}`;
                    return (
                        <li key={it.path} role="none">
                            {it.name === 'Logout' ? (
                                <button role="menuitem" aria-label="Logout" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('userRole'); localStorage.removeItem('username'); navigate('/auth'); }} className={sharedClasses}>
                                    <div className={`w-6 h-6 mb-1 ${active ? 'text-green-400' : ''}`}>{it.icon}</div>
                                    <span className="sr-only sm:not-sr-only">{it.name}</span>
                                </button>
                            ) : (
                                <Link to={it.path} role="menuitem" aria-current={active ? 'page' : undefined} className={sharedClasses}>
                                    <div className={`w-6 h-6 mb-1 ${active ? 'text-green-400' : ''}`}>{it.icon}</div>
                                    <span className="sr-only sm:not-sr-only">{it.name}</span>
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
