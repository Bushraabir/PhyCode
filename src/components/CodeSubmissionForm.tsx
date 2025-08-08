import React, { useState } from 'react';
import { submitCode, getSubmissionResult, SubmissionResult } from '@/lib/judge0';

const CodeSubmissionForm: React.FC = () => {
  const [code, setCode] = useState('');
  const [languageId, setLanguageId] = useState(71); // Default to Python
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const submission = await submitCode(code, languageId);
      if (submission.token) {
        // Poll for result (simplified; consider WebSocket for real-time)
        let resultData: SubmissionResult;
        do {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2s
          resultData = await getSubmissionResult(submission.token!);
        } while (resultData.status?.id === 1 || resultData.status?.id === 2); // In Queue or Processing

        setResult(resultData);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Language:</label>
          <select
            value={languageId}
            onChange={(e) => setLanguageId(Number(e.target.value))}
            className="border p-2"
          >
            <option value={54}>C++</option>
            <option value={71}>Python</option>
          </select>
        </div>
        <div>
          <label className="block">Code:</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-40 border p-2"
            placeholder="Enter your code here..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <div className="mt-4">
          <h3 className="font-bold">Result:</h3>
          <p>Output: {result.stdout || 'No output'}</p>
          <p>Error: {result.stderr || 'No errors'}</p>
          <p>Status: {result.status?.description || 'Unknown'}</p>
        </div>
      )}
    </div>
  );
};

export default CodeSubmissionForm;