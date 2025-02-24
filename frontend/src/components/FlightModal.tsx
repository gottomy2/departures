import React, {useEffect, useState} from "react";

interface Flight {
    id?: number;
    flightNumber: string;
    destination: string;
    status: "PLANOWANY" | "ODPRAWA" | "OPÓŹNIONY" | "ODWOŁANY";
    departureTime: string;
    zone: "SCHENGEN" | "NON_SCHENGEN";
    gate?: { gateNumber: string } | null;
    temperature: number;
}

const FlightModal: React.FC<{
    flight: Flight | null;
    mode: "add" | "edit" | "delete";
    onClose: () => void;
    onUpdate: () => void;
}> = ({flight, mode, onClose, onUpdate}) => {
    const [formData, setFormData] = useState<Flight>({
        flightNumber: "",
        destination: "",
        status: "PLANOWANY",
        departureTime: "",
        zone: "SCHENGEN",
        gate: null,
        temperature: 20,
    });

    const [gateInput, setGateInput] = useState("");

    useEffect(() => {
        if (flight) {
            setFormData(flight);
            setGateInput(flight.gate?.gateNumber || "");
        }
    }, [flight]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const token = localStorage.getItem("jwt");

    const handleSubmit = async () => {
        const updatedFlight = { ...formData, gate: gateInput ? { gateNumber: gateInput } : null };

        const method = mode === "edit" ? "PUT" : "POST";
        const url = mode === "edit"
            ? `http://localhost:8080/api/flights/${flight?.id}`
            : "http://localhost:8080/api/flights";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedFlight),
        });

        if (response.ok) {
            onUpdate();
            onClose();
        } else {
            console.error("Błąd podczas zapisywania lotu.");
        }
    };

    const handleDelete = async () => {
        if (!flight?.id) return;

        const response = await fetch(`http://localhost:8080/api/flights/${flight.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            onUpdate();
            onClose();
        } else {
            console.error("Błąd podczas usuwania lotu.");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl mb-4">
                    {mode === "add" ? "Dodaj nowy lot" : mode === "edit" ? "Edytuj lot" : "Usuń lot"}
                </h2>

                {mode === "delete" ? (
                    <>
                        <p>Czy na pewno chcesz usunąć lot <strong>{flight?.flightNumber}</strong>?</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Usuń
                            </button>
                            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Anuluj</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="text"
                                name="flightNumber"
                                placeholder="Numer lotu"
                                value={formData.flightNumber}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />

                            <input
                                type="text"
                                name="destination"
                                placeholder="Destynacja"
                                value={formData.destination}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            >
                                <option value="PLANOWANY">Planowany</option>
                                <option value="ODPRAWA">Odprawa</option>
                                <option value="OPÓŹNIONY">Opóźniony</option>
                                <option value="ODWOŁANY">Odwołany</option>
                            </select>

                            <input
                                type="text"
                                name="departureTime"
                                placeholder="Godzina odlotu"
                                value={formData.departureTime}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />

                            <select
                                name="zone"
                                value={formData.zone}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            >
                                <option value="SCHENGEN">Schengen</option>
                                <option value="NON_SCHENGEN">Non-Schengen</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Bramka"
                                value={gateInput}
                                onChange={(e) => setGateInput(e.target.value)}
                                className="border p-2 rounded"
                            />

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Temperatura: {formData.temperature}°C
                                </label>
                                <input
                                    type="range"
                                    min="-10"
                                    max="40"
                                    step="1"
                                    value={formData.temperature}
                                    onChange={(e) => setFormData((prev) => ({
                                        ...prev,
                                        temperature: Number(e.target.value)
                                    }))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer transition-all
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-4">
                            <button onClick={handleSubmit} className="bg-gray-500 text-white px-4 py-2 rounded">
                                {mode === "add" ? "Dodaj" : "Zapisz"}
                            </button>
                            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Anuluj</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FlightModal;
