import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { uploadRoomPdfThunk } from "../../redux/room/roomThunk";

import {
    FaFilePdf,
    FaUpload,
    FaSearchPlus,
    FaSearchMinus,
    FaUndo,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const PdfViewer = ({ roomId, room, currentUser }) => {
    const dispatch = useAppDispatch();

    const { currentRoom, loading } = useAppSelector(
        (state) => state.room
    );

    // Determine host status the same way RoomHeader/RoomItem do,
    // so the upload control matches what the backend will actually allow.
    const hostId =
        typeof room?.host === "object"
            ? room.host?._id?.toString()
            : room?.host?.toString();

    const currentUserId = currentUser?._id?.toString();

    const isHost = hostId === currentUserId;

    const fileInputRef = useRef(null);

    const [pdfUrl, setPdfUrl] = useState("");
    const [pdfName, setPdfName] = useState("");

    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    const [zoom, setZoom] = useState(1);

    // Load PDF from backend whenever currentRoom changes
 useEffect(() => {
    console.log("========== PDF EFFECT ==========");
    console.log("currentRoom:", currentRoom);
    console.log("pdfUrl from DB:", currentRoom?.pdfUrl);

    if (currentRoom?.pdfUrl) {
        const url = `http://localhost:5000${currentRoom.pdfUrl}`;

        console.log("Final URL:", url);

        setPdfUrl(url);
        setPdfName(currentRoom.pdfUrl.split("/").pop());
        setPageNumber(1);
    } else {
        setPdfUrl("");
        setPdfName("");
        setPageNumber(1);
        setNumPages(0);
    }
}, [currentRoom]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handlePdfChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!isHost) {
            toast.error("Only the host can upload study material.");
            return;
        }

        if (!roomId) {
            toast.error("Room not found.");
            return;
        }

        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("pdf", file);

            await dispatch(
                uploadRoomPdfThunk({
                    roomId,
                    formData,
                })
            ).unwrap();

            toast.success("PDF uploaded successfully.");

            // Clear input so same file can be selected again
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
    console.log(err);
    console.log(err.response);

    toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload PDF."
    );
}
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                hidden
                onChange={handlePdfChange}
            />

            {/* Toolbar */}

            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-3">

                <div className="flex items-center gap-2">

                    <FaFilePdf className="text-red-500 text-lg" />

                    <span className="text-sm font-medium text-white">
                        {pdfUrl ? pdfName : "No PDF Loaded"}
                    </span>

                </div>

                {pdfUrl && (
                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                setPageNumber((p) => Math.max(1, p - 1))
                            }
                            disabled={pageNumber === 1}
                            className="disabled:opacity-40"
                        >
                            <FaChevronLeft />
                        </button>

                        <span className="text-sm">
                            {pageNumber} / {numPages}
                        </span>

                        <button
                            onClick={() =>
                                setPageNumber((p) =>
                                    Math.min(numPages, p + 1)
                                )
                            }
                            disabled={pageNumber === numPages}
                            className="disabled:opacity-40"
                        >
                            <FaChevronRight />
                        </button>

                        <button
                            onClick={() =>
                                setZoom((z) =>
                                    Math.max(0.5, z - 0.1)
                                )
                            }
                        >
                            <FaSearchMinus />
                        </button>

                        <span>{Math.round(zoom * 100)}%</span>

                        <button
                            onClick={() =>
                                setZoom((z) =>
                                    Math.min(3, z + 0.1)
                                )
                            }
                        >
                            <FaSearchPlus />
                        </button>

                        <button onClick={() => setZoom(1)}>
                            <FaUndo />
                        </button>

                    </div>
                )}

            </div>

            {/* Body */}

            <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-950 p-6">

                {pdfUrl ? (
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading="Loading PDF..."
                        error="Failed to load PDF."
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={zoom}
                        />
                    </Document>
                ) : (
                    <div className="text-center">

                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
                            <FaFilePdf className="text-4xl text-red-500" />
                        </div>

                        <h2 className="mb-3 text-2xl font-bold">
                            No PDF Loaded
                        </h2>

                        <p className="mb-8 max-w-md text-slate-400">
                            Upload a PDF to study collaboratively with your team.
                        </p>

                        {isHost ? (
                            <button
                                disabled={loading}
                                onClick={handleUploadClick}
                                className="inline-flex items-center gap-3 rounded-xl bg-green-500 px-6 py-3 font-semibold transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FaUpload />
                                {loading
                                    ? "Uploading..."
                                    : "Upload PDF"}
                            </button>
                        ) : (
                            <p className="text-sm text-slate-500">
                                Waiting for the host to upload study material.
                            </p>
                        )}

                    </div>
                )}

            </div>

        </div>
    );
};

export default PdfViewer;