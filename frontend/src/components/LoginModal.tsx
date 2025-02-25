import React, {useState} from "react";

interface LoginProps {
    onLogin: () => void;
    onClose: () => void;
}

const LoginModal: React.FC<LoginProps> = ({onLogin, onClose}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");

        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password}),
        });

        if (response.ok) {
            const {token} = await response.json();
            localStorage.setItem("jwt", token);
            onLogin();
            window.location.href = "/";
        } else {
            setError("Niepoprawny login lub hasło.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[1000]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Logowanie</h2>
                <p>Dane domyślne: admin, admin</p>

                {error && <p className="text-red-500">{error}</p>}

                <input
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />

                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />

                <div className="flex justify-between mt-4">
                    <button onClick={handleLogin} className="px-4 py-2 bg-gray-500 text-white rounded">
                        Zaloguj
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Anuluj
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;