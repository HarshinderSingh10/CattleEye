import React, { useState } from "react";
import { predictBreed } from "./api/api";

const BuffaloBreedClassifier: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(""); // clear previous result
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    try {
      const response = await predictBreed(selectedFile);
      setResult(response.breed || "Unknown");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Buffalo Breed Classifier
      </h1>

      <div className="flex flex-col items-center gap-4 bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded w-full cursor-pointer"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 w-64 h-64 object-cover rounded-xl border"
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Predict Breed"}
        </button>

        {result && (
          <p className="mt-6 text-xl font-medium text-green-600">
            Predicted Breed: {result}
          </p>
        )}
      </div>
    </div>
  );
};

export default BuffaloBreedClassifier;