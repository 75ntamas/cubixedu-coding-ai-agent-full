'use client';

import { useState, useEffect } from 'react';
import { EvaluationResults } from '@/evaluation/rag/rag-evaluator';
import { PromptEvaluationResults } from '@/evaluation/prompt/prompt-evaluator';
import { RAG_EVAL_CONFIG } from '@/evaluation/rag/config';
import { PROMPT_EVAL_CONFIG } from '@/evaluation/prompt/config';

export default function DashboardPage() {
  // RAG Evaluation State
  const [results, setResults] = useState<EvaluationResults | null>(null);
  const [allResults, setAllResults] = useState<EvaluationResults[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showIndividualResults, setShowIndividualResults] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  // Prompt Evaluation State
  const [promptResults, setPromptResults] = useState<PromptEvaluationResults | null>(null);
  const [allPromptResults, setAllPromptResults] = useState<PromptEvaluationResults[]>([]);
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptEvaluating, setPromptEvaluating] = useState(false);
  const [promptProgress, setPromptProgress] = useState(0);
  const [promptProgressMessage, setPromptProgressMessage] = useState('');
  const [promptError, setPromptError] = useState<string | null>(null);
  const [showPromptIndividualResults, setShowPromptIndividualResults] = useState(false);
  const [expandedPromptResults, setExpandedPromptResults] = useState<Set<string>>(new Set());

  // Load existing results on mount
  useEffect(() => {
    loadResults();
    loadAllResults();
    loadPromptResults();
    loadAllPromptResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/evaluate/rag');
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'No results available');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const loadAllResults = async () => {
    try {
      const response = await fetch('/api/evaluate/rag?history=true');
      if (response.ok) {
        const data = await response.json();
        setAllResults(data);
      }
    } catch (err: any) {
      console.error('Failed to load history:', err);
    }
  };

  const toggleResultExpanded = (timestamp: string) => {
    setExpandedResults(prev => {
      const newSet = new Set(prev);
      if (newSet.has(timestamp)) {
        newSet.delete(timestamp);
      } else {
        newSet.add(timestamp);
      }
      return newSet;
    });
  };

  // Prompt Evaluation Functions
  const loadPromptResults = async () => {
    setPromptLoading(true);
    setPromptError(null);
    try {
      const response = await fetch('/api/evaluate/prompt');
      if (response.ok) {
        const data = await response.json();
        setPromptResults(data);
      } else {
        const errorData = await response.json();
        setPromptError(errorData.error || 'No results available');
      }
    } catch (err: any) {
      setPromptError(err.message || 'Failed to load results');
    } finally {
      setPromptLoading(false);
    }
  };

  const loadAllPromptResults = async () => {
    try {
      const response = await fetch('/api/evaluate/prompt?history=true');
      if (response.ok) {
        const data = await response.json();
        setAllPromptResults(data);
      }
    } catch (err: any) {
      console.error('Failed to load prompt history:', err);
    }
  };

  const togglePromptResultExpanded = (timestamp: string) => {
    setExpandedPromptResults(prev => {
      const newSet = new Set(prev);
      if (newSet.has(timestamp)) {
        newSet.delete(timestamp);
      } else {
        newSet.add(timestamp);
      }
      return newSet;
    });
  };

  const runPromptEvaluation = async () => {
    setPromptEvaluating(true);
    setPromptProgress(0);
    setPromptProgressMessage('Starting prompt evaluation...');
    setPromptError(null);

    try {
      const response = await fetch('/api/evaluate/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start evaluation');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'progress') {
                setPromptProgress(data.progress);
                setPromptProgressMessage(data.message);
              } else if (data.type === 'complete') {
                setPromptResults(data.results);
                setPromptProgress(100);
                setPromptProgressMessage('Evaluation complete!');
                // Reload all results to include the new one
                loadAllPromptResults();
              } else if (data.type === 'error') {
                setPromptError(data.message);
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } catch (err: any) {
      setPromptError(err.message || 'Evaluation failed');
    } finally {
      setPromptEvaluating(false);
    }
  };

  const runEvaluation = async () => {
    setEvaluating(true);
    setProgress(0);
    setProgressMessage('Starting evaluation...');
    setError(null);

    try {
      const response = await fetch('/api/evaluate/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          k: RAG_EVAL_CONFIG.K,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start evaluation');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'progress') {
                setProgress(data.progress);
                setProgressMessage(data.message);
              } else if (data.type === 'complete') {
                setResults(data.results);
                setProgress(100);
                setProgressMessage('Evaluation complete!');
                // Reload all results to include the new one
                loadAllResults();
              } else if (data.type === 'error') {
                setError(data.message);
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatDecimal = (value: number) => value.toFixed(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Monitoring Dashboard
            </h1>
            <p className="text-gray-400">
              System monitoring and evaluation metrics
            </p>
          </div>

          {/* RAG Evaluation Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              RAG Evaluation
            </h2>
          </div>

          {/* Actions */}
          <div className="mb-8 flex gap-4">
            <button
              onClick={runEvaluation}
              disabled={evaluating}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {evaluating ? (
                <>
                  Running Evaluation...
                </>
              ) : (
                <>
                  Run Evaluation
                </>
              )}
            </button>

            <button
              onClick={loadResults}
              disabled={loading || evaluating}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-medium rounded-lg transition-colors"
              title="Refresh Results"
            >
              <svg
                className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          {evaluating && (
            <div className="mb-8 bg-gray-800 rounded-lg p-6">
              <div className="mb-2 flex justify-between text-sm text-gray-300">
                <span>{progressMessage}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-900/50 border border-red-600 rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-6">
              {/* Overall Metrics */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold text-white">
                    Overall Performance
                  </h2>
                  <span className="text-sm text-gray-400">
                    {new Date(results.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard
                    title={`Precision@${RAG_EVAL_CONFIG.K}`}
                    value={formatPercent(results.aggregatedMetrics.avgPrecision)}
                    color="blue"
                  />
                  <MetricCard
                    title={`Recall@${RAG_EVAL_CONFIG.K}`}
                    value={formatPercent(results.aggregatedMetrics.avgRecall)}
                    color="green"
                  />
                  <MetricCard
                    title="MRR"
                    value={formatDecimal(results.aggregatedMetrics.avgMRR)}
                    color="purple"
                  />
                  <MetricCard
                    title="F1 Score"
                    value={formatDecimal(results.aggregatedMetrics.avgF1)}
                    color="pink"
                  />
                </div>
              </div>

              {/* Individual Results History - Collapsible */}
              <div className="bg-gray-800 rounded-lg">
                <button
                  onClick={() => setShowIndividualResults(!showIndividualResults)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-750 transition-colors rounded-lg"
                >
                  <h2 className="text-2xl font-bold text-white">
                    Evaluation History ({allResults.length} runs)
                  </h2>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${
                      showIndividualResults ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showIndividualResults && (
                  <div className="px-6 pb-6 space-y-4">
                    {allResults.map((evalResult) => {
                      const isExpanded = expandedResults.has(evalResult.timestamp);
                      const date = new Date(evalResult.timestamp);
                      const dateStr = date.toLocaleString();
                      
                      return (
                        <div key={evalResult.timestamp} className="bg-gray-900 rounded-lg">
                          <button
                            onClick={() => toggleResultExpanded(evalResult.timestamp)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-850 transition-colors rounded-lg"
                          >
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {dateStr}
                              </h3>
                              <p className="text-sm text-gray-400">
                                K={evalResult.config.k} |
                                Min Score: {evalResult.config.minSimilarityScore ?? 'N/A'} |
                                Tests: {evalResult.totalTests} |
                                Avg Precision: {formatPercent(evalResult.aggregatedMetrics.avgPrecision)} |
                                Avg Recall: {formatPercent(evalResult.aggregatedMetrics.avgRecall)}
                              </p>
                            </div>
                            <svg
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                isExpanded ? 'transform rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-4 overflow-x-auto">
                              <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                                  <tr>
                                    <th className="px-4 py-3">Test ID</th>
                                    <th className="px-4 py-3">Query</th>
                                    <th className="px-4 py-3">Difficulty</th>
                                    <th className="px-4 py-3">Precision</th>
                                    <th className="px-4 py-3">Recall</th>
                                    <th className="px-4 py-3">MRR</th>
                                    <th className="px-4 py-3">Hits</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {evalResult.individualResults.map((result) => (
                                    <tr
                                      key={result.testId}
                                      className="border-b border-gray-800 hover:bg-gray-850"
                                    >
                                      <td className="px-4 py-3 font-medium">
                                        {result.testId}
                                      </td>
                                      <td className="px-4 py-3 max-w-md truncate">
                                        {result.query}
                                      </td>
                                      <td className="px-4 py-3">
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-medium ${
                                            result.difficulty === 'easy'
                                              ? 'bg-green-900 text-green-200'
                                              : result.difficulty === 'medium'
                                              ? 'bg-yellow-900 text-yellow-200'
                                              : 'bg-red-900 text-red-200'
                                          }`}
                                        >
                                          {result.difficulty}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        {formatPercent(result.metrics.precision)}
                                      </td>
                                      <td className="px-4 py-3">
                                        {formatPercent(result.metrics.recall)}
                                      </td>
                                      <td className="px-4 py-3">
                                        {formatDecimal(result.metrics.mrr)}
                                      </td>
                                      <td className="px-4 py-3">
                                        {result.hitsCount}/{result.relevantCount || result.retrievedCount}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Results Yet */}
          {!results && !loading && !evaluating && !error && (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">
                No RAG Evaluation Results Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Click "Run Evaluation" to start assessing your RAG system
              </p>
            </div>
          )}

          {/* Prompt Evaluation Section */}
          <div className="mt-16 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Prompt Evaluation (LLM Judge)
            </h2>
          </div>

          {/* Prompt Actions */}
          <div className="mb-8 flex gap-4">
            <button
              onClick={runPromptEvaluation}
              disabled={promptEvaluating}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {promptEvaluating ? (
                <>
                  Running Prompt Evaluation...
                </>
              ) : (
                <>
                  Run Prompt Evaluation
                </>
              )}
            </button>

            <button
              onClick={loadPromptResults}
              disabled={promptLoading || promptEvaluating}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-medium rounded-lg transition-colors"
              title="Refresh Results"
            >
              <svg
                className={`w-5 h-5 ${promptLoading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          {/* Prompt Progress Bar */}
          {promptEvaluating && (
            <div className="mb-8 bg-gray-800 rounded-lg p-6">
              <div className="mb-2 flex justify-between text-sm text-gray-300">
                <span>{promptProgressMessage}</span>
                <span>{promptProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${promptProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Prompt Error Message */}
          {promptError && (
            <div className="mb-8 bg-red-900/50 border border-red-600 rounded-lg p-4">
              <p className="text-red-200">{promptError}</p>
            </div>
          )}

          {/* Prompt Results */}
          {promptResults && (
            <div className="space-y-6">
              {/* Overall Metrics */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold text-white">
                    Overall Performance
                  </h2>
                  <span className="text-sm text-gray-400">
                    {new Date(promptResults.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard
                    title="Answer Relevance"
                    value={formatDecimal(promptResults.aggregatedMetrics.avgRelevance)}
                    color="blue"
                  />
                  <MetricCard
                    title="Answer Correctness"
                    value={formatDecimal(promptResults.aggregatedMetrics.avgCorrectness)}
                    color="green"
                  />
                  <MetricCard
                    title="Groundedness"
                    value={formatDecimal(promptResults.aggregatedMetrics.avgGroundedness)}
                    color="purple"
                  />
                  <MetricCard
                    title="Pass Rate"
                    value={formatPercent(promptResults.aggregatedMetrics.passRate)}
                    color="yellow"
                  />
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Passed: {promptResults.passedTests} / {promptResults.totalTests} tests (Threshold: {PROMPT_EVAL_CONFIG.PASS_THRESHOLD}+ on all metrics)</p>
                </div>
              </div>

              {/* Individual Results History - Collapsible */}
              <div className="bg-gray-800 rounded-lg">
                <button
                  onClick={() => setShowPromptIndividualResults(!showPromptIndividualResults)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-750 transition-colors rounded-lg"
                >
                  <h2 className="text-2xl font-bold text-white">
                    Evaluation History ({allPromptResults.length} runs)
                  </h2>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${
                      showPromptIndividualResults ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showPromptIndividualResults && (
                  <div className="px-6 pb-6 space-y-4">
                    {allPromptResults.map((evalResult) => {
                      const isExpanded = expandedPromptResults.has(evalResult.timestamp);
                      const date = new Date(evalResult.timestamp);
                      const dateStr = date.toLocaleString();
                      
                      return (
                        <div key={evalResult.timestamp} className="bg-gray-900 rounded-lg">
                          <button
                            onClick={() => togglePromptResultExpanded(evalResult.timestamp)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-850 transition-colors rounded-lg"
                          >
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {dateStr}
                              </h3>
                              <p className="text-sm text-gray-400">
                                Judge: {evalResult.config.judgeModel} |
                                Tests: {evalResult.totalTests} |
                                Passed: {evalResult.passedTests} |
                                Avg Relevance: {formatDecimal(evalResult.aggregatedMetrics.avgRelevance)} |
                                Avg Correctness: {formatDecimal(evalResult.aggregatedMetrics.avgCorrectness)} |
                                Avg Groundedness: {formatDecimal(evalResult.aggregatedMetrics.avgGroundedness)}
                              </p>
                            </div>
                            <svg
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                isExpanded ? 'transform rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-4 overflow-x-auto">
                              <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                                  <tr>
                                    <th className="px-4 py-3">Test ID</th>
                                    <th className="px-4 py-3">Question</th>
                                    <th className="px-4 py-3">Difficulty</th>
                                    <th className="px-4 py-3">Relevance</th>
                                    <th className="px-4 py-3">Correctness</th>
                                    <th className="px-4 py-3">Groundedness</th>
                                    <th className="px-4 py-3">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {evalResult.individualResults.map((result) => (
                                    <tr
                                      key={result.testId}
                                      className="border-b border-gray-800 hover:bg-gray-850"
                                    >
                                      <td className="px-4 py-3 font-medium">
                                        {result.testId}
                                      </td>
                                      <td className="px-4 py-3 max-w-md truncate">
                                        {result.question}
                                      </td>
                                      <td className="px-4 py-3">
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-medium ${
                                            result.difficulty === 'easy'
                                              ? 'bg-green-900 text-green-200'
                                              : result.difficulty === 'medium'
                                              ? 'bg-yellow-900 text-yellow-200'
                                              : 'bg-red-900 text-red-200'
                                          }`}
                                        >
                                          {result.difficulty}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className={result.scores.relevance >= PROMPT_EVAL_CONFIG.PASS_THRESHOLD ? 'text-green-400' : 'text-red-400'}>
                                          {result.scores.relevance}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className={result.scores.correctness >= PROMPT_EVAL_CONFIG.PASS_THRESHOLD ? 'text-green-400' : 'text-red-400'}>
                                          {result.scores.correctness}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className={result.scores.groundedness >= PROMPT_EVAL_CONFIG.PASS_THRESHOLD ? 'text-green-400' : 'text-red-400'}>
                                          {result.scores.groundedness}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-medium ${
                                            result.passed
                                              ? 'bg-green-900 text-green-200'
                                              : 'bg-red-900 text-red-200'
                                          }`}
                                        >
                                          {result.passed ? 'PASS' : 'FAIL'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Prompt Results Yet */}
          {!promptResults && !promptLoading && !promptEvaluating && !promptError && (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Prompt Evaluation Results Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Click "Run Prompt Evaluation" to start assessing your LLM responses
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    yellow: 'from-yellow-600 to-yellow-700',
    pink: 'from-pink-600 to-pink-700',
  }[color];

  return (
    <div className={`bg-gradient-to-br ${colorClasses} rounded-lg p-3`}>
      <h3 className="text-xs font-medium text-white/80 mb-1">{title}</h3>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

