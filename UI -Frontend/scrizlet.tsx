import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Scrizlet backend error:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to Scrizlet</h1>
      <p className="mt-4">Python says: {message}</p>
    </div>
  );
}

export default App;
