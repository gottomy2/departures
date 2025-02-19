import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import FlightTable from "./components/FlightTable";
import "./index.css"

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
                <div className="container mx-auto p-6 flex-grow">
                    <Routes>
                        <Route path="/" element={<h1 className="text-center text-3xl font-semibold">Strona główna</h1>} />
                        <Route path="/flights" element={<FlightTable />} />
                        <Route path="/gates" element={<h1 className="text-center text-2xl">Sekcja bramek</h1>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;