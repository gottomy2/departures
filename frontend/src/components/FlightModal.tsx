import React, { useEffect, useState } from "react";

interface Flight {
    id?: number;
    flightNumber: string;
    destination: string;
    status: "PLANOWANY" | "ODPRAWA" | "OPÓŹNIONY" | "ODWOŁANY";
    departureTime: string;
    zone: "SCHENGEN" | "NON_SCHENGEN";
    gate?: { id: number; gateNumber: string } | null;
    temperature: number;
}

interface Gate {
    id: number;
    gateNumber: string;
}

const FlightModal: React.FC<{ flight: Flight | null; mode: "add" | "edit" | "delete"; onClose: () => void; onUpdate: () => void; }> = ({ flight, mode, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<Flight>({
        flightNumber: "",
        destination: "",
        status: "PLANOWANY",
        departureTime: new Date().toISOString().slice(0, 16), // format dla input[type="datetime-local"]
        zone: "SCHENGEN",
        gate: null,
        temperature: 20,
    });

    const [gates, setGates] = useState<Gate[]>([]);
    const [gateInput, setGateInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (flight) {
            setFormData({
                ...flight,
                departureTime: new Date(flight.departureTime).toISOString().slice(0, 16), // Konwersja na format HTML
            });
            setGateInput(flight.gate?.gateNumber || "");
        }

        fetch("http://localhost:8080/api/gates")
            .then((res) => res.json())
            .then((data) => setGates(data._embedded?.gateList || []))
            .catch((error) => console.error("Error fetching gates:", error));
    }, [flight]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGateInput(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);

        let selectedGate = gates.find((g) => g.gateNumber === gateInput);

        if (!selectedGate) {
            // Tworzymy nową bramkę, jeśli nie istnieje
            const newGateRes = await fetch("http://localhost:8080/api/gates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gateNumber: gateInput }),
            });

            if (newGateRes.ok) {
                selectedGate = await newGateRes.json();
                setGates([...gates, selectedGate]);
            } else {
                console.error("Błąd podczas dodawania nowej bramki.");
                setLoading(false);
                return;
            }
        }

        const updatedFlight = { ...formData, gate: selectedGate };

        const method = mode === "edit" ? "PUT" : "POST";
        const url = mode === "edit" ? `http://localhost:8080/api/flights/${flight?.id}` : "http://localhost:8080/api/flights";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFlight),
        });

        if (response.ok) {
            onUpdate();
            onClose();
        } else {
            console.error("Błąd podczas zapisywania lotu.");
        }

        setLoading(false);
    };

    const handleDelete = async () => {
        if (!flight) return;
        const response = await fetch(`http://localhost:8080/api/flights/${flight.id}`, { method: "DELETE" });

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
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Usuń</button>
                            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Anuluj</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col space-y-2">
                            <input type="text" name="flightNumber" placeholder="Numer lotu" value={formData.flightNumber} onChange={handleChange} className="border p-2 rounded" />

                            <input type="text" name="destination" placeholder="Destynacja" value={formData.destination} onChange={handleChange} className="border p-2 rounded" />

                            <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded">
                                <option value="PLANOWANY">Planowany</option>
                                <option value="ODPRAWA">Odprawa</option>
                                <option value="OPÓŹNIONY">Opóźniony</option>
                                <option value="ODWOŁANY">Odwołany</option>
                            </select>

                            <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} className="border p-2 rounded" />

                            <select name="zone" value={formData.zone} onChange={handleChange} className="border p-2 rounded">
                                <option value="SCHENGEN">Schengen</option>
                                <option value="NON_SCHENGEN">Non-Schengen</option>
                            </select>

                            <input type="text" placeholder="Bramka" value={gateInput} onChange={handleGateChange} className="border p-2 rounded" />

                            <input type="number" name="temperature" placeholder="Temperatura" value={formData.temperature} onChange={handleChange} className="border p-2 rounded" />
                        </div>

                        <div className="flex justify-between mt-4">
                            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
                                {loading ? "Zapisywanie..." : mode === "add" ? "Dodaj" : "Zapisz"}
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