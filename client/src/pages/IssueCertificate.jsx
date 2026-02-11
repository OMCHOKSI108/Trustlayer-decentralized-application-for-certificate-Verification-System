import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { FileText, Upload, Calendar, User, Users } from "lucide-react";

const IssueCertificate = () => {
  const [mode, setMode] = useState("single");
  const [file, setFile] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [bulkResult, setBulkResult] = useState(null);

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error("Please upload a certificate file"); return; }
    setLoading(true);
    setResult(null);
    try {
      const data = new FormData();
      data.append("certificate", file);
      if (studentName) data.append("studentName", studentName);
      if (expiryDate) data.append("expiryDate", expiryDate);
      const res = await api.post("/certificates/issue", data, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(res.data.certificate);
      toast.success("Certificate issued successfully!");
      setFile(null);
      setStudentName("");
      setExpiryDate("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to issue certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) { toast.error("Please upload a CSV file"); return; }
    setLoading(true);
    setBulkResult(null);
    try {
      const data = new FormData();
      data.append("file", csvFile);
      const res = await api.post("/certificates/bulk-issue", data, { headers: { "Content-Type": "multipart/form-data" } });
      setBulkResult(res.data);
      toast.success(`Processed ${res.data.total} records`);
      setCsvFile(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Bulk issue failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-3.5 py-2.5 bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#38383a] rounded-lg text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors";

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">Issue Certificate</h1>
        <p className="text-[15px] text-[#86868b] mt-1">
          Issue cryptographically secured certificates on the Ethereum blockchain.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-xl p-1 mb-6">
        <button
          onClick={() => { setMode("single"); setResult(null); setBulkResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium rounded-lg transition-all ${mode === "single" ? "bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm" : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]"}`}
        >
          <User className="w-4 h-4" /> Single Issue
        </button>
        <button
          onClick={() => { setMode("bulk"); setResult(null); setBulkResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium rounded-lg transition-all ${mode === "bulk" ? "bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm" : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]"}`}
        >
          <Users className="w-4 h-4" /> Bulk Issue (CSV)
        </button>
      </div>

      <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-8">
        {mode === "single" ? (
          <form onSubmit={handleSingleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Student Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g. Om Choksi" className={`${inputClasses} pl-10`} />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Expiry Date (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className={`${inputClasses} pl-10`} />
              </div>
              <p className="text-[11px] text-[#86868b] mt-1">Leave blank for non-expiring certificates</p>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Certificate File</label>
              <div className="border-2 border-dashed border-[#d2d2d7] dark:border-[#48484a] rounded-2xl p-6 text-center hover:border-[#0071e3] cursor-pointer transition-colors">
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="cert-file" />
                <label htmlFor="cert-file" className="cursor-pointer block w-full h-full">
                  <Upload className="w-7 h-7 text-[#86868b] mx-auto mb-2" />
                  {file ? (
                    <p className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">Click to upload certificate</p>
                      <p className="text-[12px] text-[#86868b] mt-1">PDF, JPG, PNG (max 10MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="bg-[#0071e3]/5 dark:bg-[#0071e3]/10 rounded-xl p-4">
              <p className="text-[12px] text-[#0071e3] leading-relaxed">
                <span className="font-semibold">Note:</span> The file is hashed securely. Only the hash is stored on the blockchain.
              </p>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#0071e3] text-white py-2.5 rounded-full text-[15px] font-medium hover:bg-[#0077ed] disabled:opacity-50 transition-colors">
              {loading ? "Processing..." : "Issue Certificate"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleBulkSubmit} className="space-y-5">
            <div className="bg-[#0071e3]/5 dark:bg-[#0071e3]/10 rounded-xl p-4 mb-4">
              <h4 className="text-[13px] font-semibold text-[#0071e3] mb-1">CSV Format Required</h4>
              <p className="text-[12px] text-[#0071e3]/80 mb-2">Your CSV must have these headers:</p>
              <code className="block bg-white dark:bg-[#2c2c2e] px-3 py-1.5 rounded-lg border border-[#d2d2d7] dark:border-[#38383a] text-[11px] font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
                studentName, courseName, studentEmail, expiryDate (optional)
              </code>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Upload CSV File</label>
              <div className="border-2 border-dashed border-[#d2d2d7] dark:border-[#48484a] rounded-2xl p-8 text-center hover:border-[#0071e3] cursor-pointer transition-colors">
                <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} className="hidden" id="csv-file" />
                <label htmlFor="csv-file" className="cursor-pointer block w-full h-full">
                  <FileText className="w-7 h-7 text-[#86868b] mx-auto mb-2" />
                  {csvFile ? (
                    <p className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{csvFile.name}</p>
                  ) : (
                    <>
                      <p className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">Click to upload CSV</p>
                      <p className="text-[12px] text-[#86868b] mt-1">.csv files only</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#0071e3] text-white py-2.5 rounded-full text-[15px] font-medium hover:bg-[#0077ed] disabled:opacity-50 transition-colors">
              {loading ? "Processing Bulk Issue..." : "Process Bulk Issue"}
            </button>
          </form>
        )}
      </div>

      {/* Single Result */}
      {result && (
        <div className="mt-6 bg-[#30d158]/10 rounded-2xl p-6 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#30d158]/20 rounded-full flex items-center justify-center text-[#30d158]">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#30d158]">Certificate Issued Successfully</h3>
          </div>
          <div className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] space-y-1.5">
            <p><span className="text-[#86868b]">Certificate ID:</span> {result.certId}</p>
            <p><span className="text-[#86868b]">Tx Hash:</span> <span className="font-mono text-[11px] break-all">{result.txHash}</span></p>
          </div>
        </div>
      )}

      {/* Bulk Result */}
      {bulkResult && (
        <div className="mt-6 space-y-4 animate-fadeIn">
          <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-6">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Bulk Processing Report</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white dark:bg-[#2c2c2e] p-3 rounded-xl text-center">
                <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Total</p>
                <p className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{bulkResult.total}</p>
              </div>
              <div className="bg-[#30d158]/10 p-3 rounded-xl text-center">
                <p className="text-[10px] text-[#30d158] uppercase tracking-wider">Success</p>
                <p className="text-[22px] font-semibold text-[#30d158]">{bulkResult.successful}</p>
              </div>
              <div className="bg-[#ff453a]/10 p-3 rounded-xl text-center">
                <p className="text-[10px] text-[#ff453a] uppercase tracking-wider">Failed</p>
                <p className="text-[22px] font-semibold text-[#ff453a]">{bulkResult.failed}</p>
              </div>
            </div>

            {bulkResult.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="text-[13px] font-semibold text-[#ff453a] mb-2">Errors</h4>
                <div className="bg-[#ff453a]/5 rounded-xl p-3 max-h-40 overflow-y-auto text-[12px] text-[#ff453a] space-y-1">
                  {bulkResult.errors.map((err, idx) => (
                    <p key={idx}>Row {JSON.stringify(err.row)}: {err.error}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueCertificate;
