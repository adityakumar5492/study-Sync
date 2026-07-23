import { useRef, useState } from "react";
import {
  FaFilePdf,
  FaUpload,
  FaSearchPlus,
  FaSearchMinus,
  FaUndo,
} from "react-icons/fa";

const PdfViewer = ({ roomId }) => {
  const fileInputRef = useRef(null);

  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [zoom, setZoom] = useState(100);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setPdfFile(file);
    setPdfName(file.name);
    setPdfLoaded(true);

    // Later:
    // uploadPdf(roomId, file);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col">
      {/* Hidden Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handlePdfChange}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-2 text-slate-400">
          <FaFilePdf className="text-red-500" />

          <span className="text-sm text-white font-medium">
            {pdfLoaded ? pdfName : "No PDF Loaded"}
          </span>
        </div>

        {pdfLoaded && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
              className="text-slate-400 hover:text-white"
            >
              <FaSearchMinus />
            </button>

            <span className="text-sm">{zoom}%</span>

            <button
              onClick={() => setZoom((prev) => Math.min(200, prev + 10))}
              className="text-slate-400 hover:text-white"
            >
              <FaSearchPlus />
            </button>

            <button
              onClick={() => setZoom(100)}
              className="text-slate-400 hover:text-white"
            >
              <FaUndo />
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center p-8">
        {pdfLoaded ? (
          <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <FaFilePdf className="text-red-500 text-7xl mx-auto mb-4" />

              <h2 className="text-xl font-semibold mb-2">
                {pdfName}
              </h2>

              <p className="text-slate-400">
                Room: {roomId}
              </p>

              <p className="text-slate-400">
                Zoom: {zoom}%
              </p>

              <p className="mt-6 text-slate-500 text-sm">
                PDF preview will be rendered here using React-PDF.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <FaFilePdf className="text-red-500 text-4xl" />
            </div>

            <h2 className="text-2xl font-bold mb-3">
              No PDF Loaded
            </h2>

            <p className="text-slate-400 max-w-md mb-8">
              Upload a PDF to study collaboratively with your team.
            </p>

            <button
              onClick={handleUploadClick}
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold transition"
            >
              <FaUpload />
              Upload PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;