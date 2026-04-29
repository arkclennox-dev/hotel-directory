"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

type ImportResult = {
  inserted: number;
  updated: number;
  skipped: number;
  skipped_rows: string[];
  columns_detected: string[];
};

type Status = "idle" | "parsing" | "preview" | "uploading" | "done" | "error";

export default function ImportButton() {
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const reset = () => {
    setStatus("idle");
    setFileName("");
    setRows([]);
    setResult(null);
    setErrorMsg("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    setStatus("parsing");
    setErrorMsg("");

    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (!result.data || result.data.length === 0) {
            setStatus("error");
            setErrorMsg("File CSV kosong atau tidak bisa dibaca.");
            return;
          }
          setRows(result.data as Record<string, unknown>[]);
          setStatus("preview");
        },
        error: (err) => {
          setStatus("error");
          setErrorMsg("Gagal parse CSV: " + err.message);
        },
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target!.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const parsed = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
            defval: "",
            raw: false,
          });
          if (!parsed || parsed.length === 0) {
            setStatus("error");
            setErrorMsg("File Excel kosong atau tidak bisa dibaca.");
            return;
          }
          setRows(parsed);
          setStatus("preview");
        } catch (err: any) {
          setStatus("error");
          setErrorMsg("Gagal parse Excel: " + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setStatus("error");
      setErrorMsg("Format tidak didukung. Gunakan file .csv atau .xlsx");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleImport = async () => {
    setStatus("uploading");
    try {
      const res = await fetch("/api/admin/hotels/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMsg(data.error || "Import gagal.");
        return;
      }
      setResult(data);
      setStatus("done");
      router.refresh();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  const previewRows = rows.slice(0, 5);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors border border-gray-600"
      >
        <Upload className="w-4 h-4" />
        Import CSV/XLSX
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                <h2 className="text-white font-semibold">Import Hotel dari CSV / Excel</h2>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Step 1: Upload area */}
              {(status === "idle" || status === "parsing") && (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-xl p-10 text-center cursor-pointer transition-colors group"
                >
                  {status === "parsing" ? (
                    <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-3" />
                  ) : (
                    <Upload className="w-10 h-10 text-gray-500 group-hover:text-blue-400 mx-auto mb-3 transition-colors" />
                  )}
                  <p className="text-white font-medium mb-1">
                    {status === "parsing" ? "Membaca file..." : "Drag & drop atau klik untuk pilih file"}
                  </p>
                  <p className="text-sm text-gray-500">Format yang didukung: .csv, .xlsx, .xls</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                  />
                </div>
              )}

              {/* Format hint */}
              {status === "idle" && (
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 text-xs text-gray-400 space-y-1.5">
                  <p className="text-gray-300 font-medium text-sm mb-2">Kolom yang dikenali (nama bebas, tidak harus semua ada):</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 font-mono">
                    {["name / nama", "slug", "city_id", "address / alamat", "short_description", "full_description",
                      "star_rating / bintang", "price_from / harga mulai", "price_to", "property_type / tipe",
                      "phone / telepon", "website_url", "hero_image_url / foto", "is_published / status",
                      "is_featured / unggulan", "seo_title", "seo_description"].map((c) => (
                      <span key={c} className="text-gray-400">• {c}</span>
                    ))}
                  </div>
                  <p className="text-gray-500 mt-2">Kolom tidak dikenal akan diabaikan. Kolom tidak ada = dikosongkan.</p>
                </div>
              )}

              {/* Step 2: Preview */}
              {status === "preview" && (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <FileSpreadsheet className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">{fileName}</p>
                      <p className="text-gray-400 text-xs">{rows.length} baris · {headers.length} kolom terdeteksi</p>
                    </div>
                  </div>

                  {/* Tabel preview */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Preview 5 baris pertama:</p>
                    <div className="overflow-x-auto rounded-lg border border-gray-700">
                      <table className="text-xs w-full">
                        <thead>
                          <tr className="bg-gray-800 border-b border-gray-700">
                            {headers.map((h) => (
                              <th key={h} className="px-3 py-2 text-left text-gray-400 font-medium whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {previewRows.map((row, i) => (
                            <tr key={i} className="bg-gray-900">
                              {headers.map((h) => (
                                <td key={h} className="px-3 py-2 text-gray-300 whitespace-nowrap max-w-[160px] truncate">
                                  {String(row[h] ?? "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {rows.length > 5 && (
                      <p className="text-xs text-gray-500 mt-1.5">... dan {rows.length - 5} baris lainnya</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleImport}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Import {rows.length} Hotel
                    </button>
                    <button
                      onClick={reset}
                      className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Ganti File
                    </button>
                  </div>
                </>
              )}

              {/* Uploading */}
              {status === "uploading" && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                  <p className="text-white font-medium">Mengimpor data ke Supabase...</p>
                  <p className="text-gray-400 text-sm">Memproses {rows.length} baris</p>
                </div>
              )}

              {/* Done */}
              {status === "done" && result && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-white font-semibold">Import selesai!</p>
                      <p className="text-gray-400 text-sm">Data berhasil disimpan ke Supabase.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-gray-800 p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-400">{result.inserted}</p>
                      <p className="text-xs text-gray-400 mt-1">Hotel baru ditambahkan</p>
                    </div>
                    <div className="rounded-xl bg-gray-800 p-4 text-center">
                      <p className="text-2xl font-bold text-blue-400">{result.updated}</p>
                      <p className="text-xs text-gray-400 mt-1">Hotel diperbarui</p>
                    </div>
                    <div className="rounded-xl bg-gray-800 p-4 text-center">
                      <p className="text-2xl font-bold text-gray-400">{result.skipped}</p>
                      <p className="text-xs text-gray-400 mt-1">Baris dilewati</p>
                    </div>
                  </div>
                  {result.columns_detected.length > 0 && (
                    <div className="rounded-xl bg-gray-800 p-4">
                      <p className="text-xs text-gray-400 mb-2">Kolom yang berhasil dipetakan:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.columns_detected.map((col) => (
                          <span key={col} className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-mono">{col}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.skipped_rows.length > 0 && (
                    <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
                      <p className="text-yellow-400 text-xs font-medium mb-2">Baris yang dilewati:</p>
                      <ul className="space-y-1">
                        {result.skipped_rows.slice(0, 5).map((r, i) => (
                          <li key={i} className="text-xs text-gray-400 truncate">{r}</li>
                        ))}
                        {result.skipped_rows.length > 5 && (
                          <li className="text-xs text-gray-500">... dan {result.skipped_rows.length - 5} lainnya</li>
                        )}
                      </ul>
                    </div>
                  )}
                  <button
                    onClick={handleClose}
                    className="w-full px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              )}

              {/* Error */}
              {status === "error" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white font-medium">Terjadi kesalahan</p>
                      <p className="text-gray-400 text-sm mt-1">{errorMsg}</p>
                    </div>
                  </div>
                  <button
                    onClick={reset}
                    className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
