import React, { useState } from 'react';
import { useResQ } from '../context/ResQContext';
import { X, Sparkles, Send, MapPin, Radio, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { parseAndTriageReport } from '../../server/services/aiEngine';

export default function IntakeModal() {
  const { isIntakeOpen, setIsIntakeOpen, ingestNewReport } = useResQ();

  const [mode, setMode] = useState('RAW_TEXT'); // 'RAW_TEXT' | 'STRUCTURED_FORM'
  const [rawText, setRawText] = useState('');
  const [sourceType, setSourceType] = useState('SMS');
  const [sourceName, setSourceName] = useState('Citizen Emergency Hotline (911)');
  const [reporterContact, setReporterContact] = useState('+1 (555) 019-3382');
  const [locationName, setLocationName] = useState('');

  // AI Live Triage State
  const [aiPreview, setAiPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  if (!isIntakeOpen) return null;

  const handleAiAnalyze = async () => {
    if (!rawText.trim()) return;
    setIsAnalyzing(true);
    try {
      const triage = await parseAndTriageReport(rawText, {
        sourceType,
        sourceName,
        reporterContact,
        locationName
      });
      setAiPreview(triage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsSubmitting(true);
    try {
      const resultReport = await ingestNewReport(rawText, {
        sourceType,
        sourceName,
        reporterContact,
        locationName: locationName || undefined
      });

      setSubmittedResult(resultReport);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRawText('');
    setAiPreview(null);
    setSubmittedResult(null);
    setIsIntakeOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-2xl border border-slate-700/80 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Multi-Source Incident Intake</h2>
              <p className="text-xs text-slate-400">Ingest structured forms or raw unstructured SOS text into AI pipeline</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If successfully submitted, display the full AI Extracted Result Screen */}
        {submittedResult ? (
          <div className="space-y-4 overflow-y-auto pr-1 text-xs">
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-700/60 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-white text-sm font-heading">Incident Successfully Ingested &amp; AI Triaged</h3>
                <p className="text-emerald-200 text-xs mt-0.5">
                  Report ID <span className="font-mono-code font-bold">{submittedResult.id}</span> has been processed by the clustering engine and synced with backend services.
                </p>
              </div>
            </div>

            {/* AI Result Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono-code">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> AI TRIAGE EXTRACTION SUMMARY
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px]">
                  STATUS: TRIAGED &amp; CLUSTERED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">Category</div>
                  <div className="font-bold text-white text-sm">{submittedResult.category}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Severity Rating</div>
                  <div className="font-bold text-rose-400 text-sm">Sev {submittedResult.severity}/5</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Resolved Location</div>
                  <div className="font-bold text-slate-200">{submittedResult.locationName}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Victims Trapped/At Risk</div>
                  <div className="font-bold text-amber-400">{submittedResult.extractedEntities?.trappedVictims || 0} Persons</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Urgency Rating</div>
                  <div className="font-bold text-cyan-300 uppercase">{submittedResult.extractedEntities?.urgency || 'HIGH'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Detected Hazards</div>
                  <div className="font-bold text-amber-300 truncate">{submittedResult.extractedEntities?.hazards?.join(', ') || 'Floodwater, Electrical'}</div>
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[10px] mb-1">Recommended Resource Allocations</div>
                <div className="flex flex-wrap gap-1.5">
                  {(submittedResult.resourceNeeds || ['Evacuation Boat', 'Medical Team']).map((r, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px] font-bold">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-400">
                Verbatim SOS Input: "{submittedResult.rawText}"
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSubmittedResult(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
              >
                + Ingest Another Incident
              </button>
              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg"
              >
                Close &amp; View on Command Hub
              </button>
            </div>
          </div>
        ) : (
          /* Intake Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto pr-1">
            
            {/* Ingestion Mode Toggle */}
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('RAW_TEXT')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  mode === 'RAW_TEXT'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5 inline mr-1.5" />
                Raw Text / Social / SMS Parser
              </button>

              <button
                type="button"
                onClick={() => setMode('STRUCTURED_FORM')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  mode === 'STRUCTURED_FORM'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                Structured Intake Form
              </button>
            </div>

            {/* Source Metadata Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Source Channel</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="SMS">Emergency SMS (911 / Citizen)</option>
                  <option value="SOCIAL">Social Media Stream (X / Twitter)</option>
                  <option value="FORM">Official Agency Field Report</option>
                  <option value="PHONE">Radio / Call Dispatch</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Source Identity / Handle</label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. @citizen_alert or Station 12"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Raw Text Box */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 font-semibold">
                  {mode === 'RAW_TEXT' ? 'Paste Unstructured Emergency Text / SOS Message' : 'Detailed Incident Narrative'}
                </label>
                <button
                  type="button"
                  onClick={handleAiAnalyze}
                  disabled={isAnalyzing || !rawText.trim()}
                  className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAnalyzing ? 'Analyzing...' : 'Test AI Extraction'}
                </button>
              </div>

              <textarea
                rows={4}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="e.g. SOS! Water rising inside living room at 4th and Harrison! 3 trapped on roof with infant. Need rescue boat immediately!"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed font-mono-code"
              />
            </div>

            {/* Location override if needed */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Location / Landmark (Optional Override)</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. 4th St & Harrison St (Leave blank for AI auto-geocode)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* AI Extraction Preview Card */}
            {aiPreview && (
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-700/60 space-y-2 animate-fadeIn font-mono-code">
                <div className="flex items-center justify-between text-cyan-300 font-bold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    AI EXTRACTED TRIAGE METADATA
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-900 text-cyan-200">
                    {Math.round(aiPreview.aiConfidence * 100)}% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">Detected Category:</span>
                    <span className="ml-1 font-bold text-white">{aiPreview.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Assigned Severity:</span>
                    <span className="ml-1 font-bold text-rose-400">Sev {aiPreview.severity}/5</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Resolved Location:</span>
                    <span className="ml-1 font-bold text-white truncate block">{aiPreview.locationName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Estimated Victims:</span>
                    <span className="ml-1 font-bold text-amber-400">{aiPreview.extractedEntities.trappedVictims} Persons</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-slate-400 text-[10px] mr-1">Resource Tags:</span>
                  {aiPreview.resourceNeeds.map((r, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 text-[10px]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !rawText.trim()}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-600/30 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Ingesting via Backend API...' : 'Ingest & Run AI Triage'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
