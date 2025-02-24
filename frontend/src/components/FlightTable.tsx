import React, {JSX, useEffect, useState} from "react";
import {
    FaArrowLeft,
    FaArrowRight,
    FaClock,
    FaCloudRain,
    FaEdit,
    FaExclamationTriangle,
    FaPlaneDeparture,
    FaPlaneSlash,
    FaPlus,
    FaSnowflake,
    FaSun,
    FaTrash,
} from "react-icons/fa";
import FlightModal from "./FlightModal";

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
    PLANOWANY: "inline-flex items-center m-1 px-3 py-1 bg-green-200 bg-opacity-50 hover:bg-green-300 rounded-full text-sm font-semibold text-green-600",
    ODWOŁANY: "inline-flex items-center m-1 px-3 py-1 bg-red-200 bg-opacity-50 hover:bg-red-300 rounded-full text-sm font-semibold text-red-600",
    ODPRAWA: "inline-flex items-center m-1 px-3 py-1 bg-blue-200 bg-opacity-50 hover:bg-blue-300 rounded-full text-sm font-semibold text-blue-600",
    OPÓŹNIONY: "inline-flex items-center m-1 px-3 py-1 bg-yellow-200 bg-opacity-50 hover:bg-yellow-300 rounded-full text-sm font-semibold text-yellow-600",
};

const statusIcons: Record<string, JSX.Element> = {
    PLANOWANY: <FaPlaneDeparture className="inline mr-2"/>,
    ODWOŁANY: <FaPlaneSlash className="inline mr-2"/>,
    ODPRAWA: <FaClock className="inline mr-2"/>,
    OPÓŹNIONY: <FaExclamationTriangle className="inline mr-2"/>,
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
    const [searchQuery, setSearchQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");

    const token = localStorage.getItem("jwt");

    useEffect(() => {
        setCurrentPage(0);
    }, [zoneFilter, statusFilter]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = () => {
            const params = new URLSearchParams();
            params.append("page", currentPage.toString());
            params.append("size", "10");

            if (searchQuery) params.append("flightNumber", searchQuery);
            if (zoneFilter) params.append("zone", zoneFilter);
            if (statusFilter) params.append("status", statusFilter);

            fetch(`http://localhost:8080/api/flights?${params.toString()}`, {signal})
                .then((res) => res.json())
                .then((data) => {
                    setFlights(data._embedded?.flightList || []);
                    setTotalPages(data.page?.totalPages || 1);
                })
                .catch((error) => {
                    if (error.name !== "AbortError") {
                        console.error("Error fetching flights:", error);
                    }
                });
        };

        // Dla wyszukiwania stosujemy debounce
        if (searchQuery) {
            const delayDebounceFn = setTimeout(() => {
                fetchData();
            }, 500);

            return () => {
                clearTimeout(delayDebounceFn);
                controller.abort();
            };
        } else {
            // Dla paginacji i pozostałych filtrów wywołujemy natychmiast
            fetchData();
            return () => controller.abort();
        }
    }, [searchQuery, zoneFilter, statusFilter, currentPage]);


    const getWeatherIcon = (temperature: number) => {
        if (temperature >= 25) return weatherIcons.hot;
        if (temperature <= 5) return weatherIcons.cold;
        return weatherIcons.rainy;
    };

    const openModal = (flight: Flight | null, mode: "add" | "edit" | "delete") => {
        setSelectedFlight(flight);
        setModalMode(mode);
        setModalOpen(true);
    };

    return (
        <>
            <div className="flex flex-col items-center w-full">
                <h2 className="text-xl font-semibold mb-2 text-left w-full max-w-[1050px]">Filtry Wyszukiwania</h2>
                <div className="w-full max-w-[1050px] flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                        {/* Pole wyszukiwania */}
                        <input
                            type="text"
                            placeholder="Szukaj po numerze lotu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 border bg-white shadow-sm rounded"
                        />

                        {/* Filtr strefy */}
                        <select
                            value={zoneFilter}
                            onChange={(e) => setZoneFilter(e.target.value)}
                            className="p-2 border bg-white shadow-sm"
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

                    {token && (
                        <button
                            onClick={() => openModal(null, "add")}
                            className="px-4 py-2 bg-gray-500 text-white rounded flex items-center"
                        >
                            <FaPlus className="mr-2" /> Dodaj lot
                        </button>
                    )}
                </div>
                <table className="w-auto border-collapse shadow-lg bg-white">
                    <thead className="border-b">
                    <tr>
                        <th className="p-4 text-left text-center">Numer rejsu</th>
                        <th className="p-4 text-left text-center">Destynacja</th>
                        <th className="p-4 text-left text-center">Status</th>
                        <th className="p-4 text-left text-center">Godzina odlotu</th>
                        <th className="p-4 text-left text-center">Strefa</th>
                        <th className="p-4 text-left text-center">Bramka</th>
                        <th className="p-4 text-left text-center">Temperatura</th>
                        {token && <th className="p-4 text-left text-center">Akcja</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {flights.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="p-4 text-center text-gray-500">
                                Brak lotów spełniających podane kryteria, spróbuj użyć innych filtrów ;)
                            </td>
                        </tr>
                    ) : (
                        flights.map((flight) => (
                            <tr key={flight.id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 font-semibold">{flight.flightNumber}</td>
                                <td className="p-4">{flight.destination}</td>
                                <td className="p-4 table-cell text-center align-middle">
                                    <div
                                        className={`inline-flex items-center justify-center px-3 py-1 ${statusColors[flight.status]}`}>
                                        {statusIcons[flight.status] || null} {flight.status}
                                    </div>
                                </td>
                                <td className="p-4">{new Date(flight.departureTime).toLocaleString()}</td>
                                <td className="p-4">{flight.zone}</td>
                                <td className="p-4">{flight.gate?.gateNumber || "—"}</td>
                                <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                        {getWeatherIcon(flight.temperature)}
                                        <span>{flight.temperature}°C</span>
                                    </div>
                                </td>
                                <td className="p-4 flex space-x-2">
                                    {token && (
                                        <>
                                            <button onClick={() => openModal(flight, "edit")} className="px-2 py-1 rounded">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => openModal(flight, "delete")} className="px-2 py-1 rounded">
                                                <FaTrash />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>

                {/* 🔹 Paginacja */}
                <div className="flex justify-between w-1/4 mt-4">
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

            {modalOpen && (
                <FlightModal
                    flight={selectedFlight}
                    mode={modalMode}
                    onClose={() => setModalOpen(false)}
                    onUpdate={() => window.location.reload()}
                />
            )}
        </>
    );
};

export default FlightTable;