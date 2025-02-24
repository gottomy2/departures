import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlaneDeparture, FaTable, FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import LoginModal from "./LoginModal.tsx";

const Navbar: React.FC = () => {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt"));
    const [showLogin, setShowLogin] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        window.location.href = "/";
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setShowLogin(false);
    };

    const handleCloseLoginModal = () => {
        setShowLogin(false);
    };

    const navItems = [
        // { path: "/", label: "Strona główna", icon: <FaTable /> },
    ];

    return (
        <>
            <nav className="bg-white shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-gray-600 flex items-center hover:text-gray-800 transition">
                        <FaPlaneDeparture className="mr-2" />
                        Departures
                    </Link>

                    <ul className="flex space-x-6">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded transition ${
                                        location.pathname === item.path ? "bg-gray-500 text-white" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Przycisk logowania / wylogowania */}
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-500 text-white rounded">
                            <FaSignOutAlt className="mr-2" />
                            Wyloguj
                        </button>
                    ) : (
                        <button onClick={() => setShowLogin(true)} className="flex items-center px-4 py-2 bg-gray-500 text-white rounded">
                            <FaUser className="mr-2" />
                            Zaloguj
                        </button>
                    )}
                </div>
            </nav>

            {/* Panel logowania */}
            {showLogin && <LoginModal onLogin={handleLoginSuccess} onClose={handleCloseLoginModal}/>}
        </>
    );
};

export default Navbar;