import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

const PdfAnnotationEditor = ({
    roomId,
    pageNumber,
}) => {
    return (
        <div
            className="absolute inset-0 z-20"
            style={{
                pointerEvents: "auto",
            }}
        >
            <Tldraw
                persistenceKey={`studysync-pdf-${roomId}-page-${pageNumber}`}
                camera={{
                    isLocked: false,
                    wheelBehavior: "none",
                    panSpeed: 1,
                    zoomSpeed: 1,
                }}
            />
        </div>
    );
};

export default PdfAnnotationEditor;