import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlaneDeparture, FaTable, FaHome } from "react-icons/fa";

const Navbar: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: "/", label: "Strona główna", icon: <FaHome /> },
        { path: "/flights", label: "Loty", icon: <FaTable /> },
        { path: "/gates", label: "Bramki", icon: <FaPlaneDeparture /> },
    ];

    return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-600 flex items-center">
                    <FaPlaneDeparture className="mr-2" />
                    Departures
                </div>

                <ul className="flex space-x-6">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center space-x-2 px-4 py-2 rounded transition duration-200 ${
                                    location.pathname === item.path
                                        ? "bg-gray-500 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;