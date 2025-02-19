import React, {JSX, useEffect, useState} from "react";
import {
    FaArrowLeft,
    FaArrowRight,
    FaClock,
    FaCloudRain,
    FaExclamationTriangle,
    FaPlaneDeparture,
    FaPlaneSlash,
    FaSnowflake,
    FaSun
} from "react-icons/fa";

interface Flight {
    id: number;
    flightNumber: string;
    destination: string;
    status: string;
    departureTime: string;
    zone: string;
    gate: { gateNumber: string } | null;
    temperature: number;
}

const statusColors: Record<string, string> = {
    PLANOWANY: "text-gray-500",
    ODWOŁANY: "text-red-500",
    ODPRAWA: "text-yellow-500",
    OPÓŹNIONY: "text-orange-500",
};

const statusIcons: Record<string, JSX.Element> = {
    PLANOWANY: <FaPlaneDeparture className="inline mr-2"/>,
    ODWOŁANY: <FaPlaneSlash className="inline mr-2"/>,
    ODPRAWA: <FaClock className="inline mr-2"/>,
    OPÓŹNIONY: <FaExclamationTriangle className="inline mr-2 text-orange-500"/>,
};

const weatherIcons: Record<string, JSX.Element> = {
    hot: <FaSun className="text-yellow-500"/>,
    rainy: <FaCloudRain className="text-blue-400"/>,
    cold: <FaSnowflake className="text-blue-600"/>,
};

const FlightTable: React.FC = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [zoneFilter, setZoneFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        setCurrentPage(0);
    }, [zoneFilter, statusFilter]);

    useEffect(() => {
        const params = new URLSearchParams();
        params.append("page", currentPage.toString());
        params.append("size", "12");
        if (zoneFilter) params.append("zone", zoneFilter);
        if (statusFilter) params.append("status", statusFilter);

        fetch(`http://localhost:8080/api/flights?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setFlights(data._embedded?.flightList || []);
                setTotalPages(data.page.totalPages || 1);
            })
            .catch((error) => console.error("Error fetching flights:", error));
    }, [currentPage, zoneFilter, statusFilter]);


    const getWeatherIcon = (temperature: number) => {
        if (temperature >= 25) return weatherIcons.hot;
        if (temperature <= 5) return weatherIcons.cold;
        return weatherIcons.rainy;
    };

    return (
        <>
            <div className="flex flex-col items-center w-full">
                {/* 🔹 Kontener filtrów i tabeli */}
                <div className="w-auto flex justify-between items-center mb-4">
                    {/* Filtr strefy */}
                    <select
                        value={zoneFilter}
                        onChange={(e) => setZoneFilter(e.target.value)}
                        className="p-2 border bg-white shadow-sm mr-4"
                    >
                        <option value="">Wszystkie strefy</option>
                        <option value="SCHENGEN">Schengen</option>
                        <option value="NON_SCHENGEN">Non-Schengen</option>
                    </select>

                    {/* Filtr statusu */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-2 border bg-white shadow-sm"
                    >
                        <option value="">Wszystkie statusy</option>
                        <option value="PLANOWANY">Planowany</option>
                        <option value="ODPRAWA">Odprawa</option>
                        <option value="OPÓŹNIONY">Opóźniony</option>
                        <option value="ODWOŁANY">Odwołany</option>
                    </select>
                </div>

                {/* 🔹 Tabela lotów */}
                <table className="w-auto border-collapse shadow-lg bg-white">
                    <thead className="bg-gray-200 text-gray-700">
                    <tr>
                        <th className="p-4 text-left">Numer rejsu</th>
                        <th className="p-4 text-left">Destynacja</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Godzina odlotu</th>
                        <th className="p-4 text-left">Strefa</th>
                        <th className="p-4 text-left">Bramka</th>
                        <th className="p-4 text-left">Temperatura</th>
                    </tr>
                    </thead>
                    <tbody>
                    {flights.map((flight) => (
                        <tr key={flight.id} className="border-b hover:bg-gray-50 transition">
                            <td className="p-4 font-semibold">{flight.flightNumber}</td>
                            <td className="p-4">{flight.destination}</td>
                            <td className={`p-4 font-medium ${statusColors[flight.status] || "text-gray-700"}`}>
                                {statusIcons[flight.status] || null} {flight.status}
                            </td>
                            <td className="p-4">{new Date(flight.departureTime).toLocaleString()}</td>
                            <td className="p-4">{flight.zone}</td>
                            <td className="p-4">{flight.gate?.gateNumber || "—"}</td>
                            <td className="p-4 flex items-center space-x-2">
                                <span>{getWeatherIcon(flight.temperature)}</span>
                                <span>{flight.temperature}°C</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* 🔹 Paginacja */}
                <div className="flex justify-between w-1/2 mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className={`flex items-center px-4 py-2 border rounded ${currentPage === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500 text-white hover:bg-gray-600"}`}
                    >
                        <FaArrowLeft className="mr-2"/> Poprzednia
                    </button>
                    <span className="text-gray-700 font-medium">
                Strona {currentPage + 1} z {totalPages}
            </span>
                    <button
                        onClick={() => setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))}
                        disabled={currentPage >= totalPages - 1}
                        className={`flex items-center px-4 py-2 border rounded ${currentPage >= totalPages - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500 text-white hover:bg-gray-600"}`}
                    >
                        Następna <FaArrowRight className="ml-2"/>
                    </button>
                </div>
            </div>
        </>
    );
};

export default FlightTable;