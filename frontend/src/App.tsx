import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import FlightTable from "./components/FlightTable";
import "./index.css";

const App: React.FC = () => {
    return (
        <Router>
            <Navbar/>
            <div className="relative min-h-screen flex flex-col">
                <div
                    className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

                <div className="relative z-10 container mx-auto p-6 flex-grow">
                    <Routes>
                        <Route path="/" element={<FlightTable/>}/>
                        <Route path="/gates" element={<h1 className="text-center text-2xl">Sekcja bramek</h1>}/>
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;