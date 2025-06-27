import React, { useState } from 'react';

interface Detection {
  type: string;
  confidence: number;
  bbox: [number, number, number, number];
  degradation: string;
  suggested_use: string;
}

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const sendToBackend = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        body: JSON.stringify({ image }), // backend should accept base64
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setDetections(data.detections || []);
    } catch (error) {
      console.error('API error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">🌊 OceanPlastic AI</h1>

      {/* Upload Section */}
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {image && <img src={image} alt="preview" className="max-h-96 rounded-lg border" />}
      <button
        onClick={sendToBackend}
        disabled={loading}
        className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        {loading ? 'Detecting...' : 'Analyze Plastic'}
      </button>

      {/* Detection Results */}
      {detections.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-2xl font-semibold">Detections:</h2>
          {detections.map((d, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded">
              <p><strong>Type:</strong> {d.type}</p>
              <p><strong>Confidence:</strong> {(d.confidence * 100).toFixed(1)}%</p>
              <p><strong>Degradation:</strong> {d.degradation}</p>
              <p><strong>Upcycle Suggestion:</strong> {d.suggested_use}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
