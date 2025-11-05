"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const LOGO_PATH = "/university-logo.png"; // offline logo in /public
const MY_PHOTO = "/faisal-photo.png"; // apna photo /public me rakhein

export default function Page() {
  const [mode, setMode] = useState("assignment");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [dept, setDept] = useState("");
  const [teacher, setTeacher] = useState("");
  const [fileName, setFileName] = useState("My_PDF");
  const [content, setContent] = useState("");

  // ======= PWA: Service Worker Registration =======
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker registered with scope:", registration.scope);
        } catch (err) {
          console.error("Service Worker registration failed:", err);
        }
      };
      window.addEventListener("load", registerSW);
      return () => window.removeEventListener("load", registerSW);
    }
  }, []);

  const generatePDF = async () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let pageNumber = 1;

    // ========= Assignment Mode =========
    if (mode === "assignment") {
      const logo = new Image();
      logo.src = LOGO_PATH;
      await new Promise((res) => (logo.onload = res));

      const logoWidth = 100;
      const logoHeight = 100;
      const centerX = pageWidth / 2;

      doc.addImage(logo, "PNG", centerX - logoWidth / 2, 100, logoWidth, logoHeight);

      doc.setFont("times", "bold");
      doc.setFontSize(22);
      doc.text("University of Sargodha", centerX, 240, { align: "center" });

      doc.setFont("times", "italic");
      doc.setFontSize(14);
      doc.text(`Department of ${dept}`, centerX, 270, { align: "center" });

      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text(`Assignment Title`, centerX, 320, { align: "center" });

      doc.setFont("times", "normal");
      doc.setFontSize(14);
      doc.text(title || "Untitled Assignment", centerX, 340, { align: "center" });

      doc.setFontSize(13);
      doc.setFont("times", "bold");
      doc.text("Submitted By:", centerX - 50, 400, { align: "right" });
      doc.setFont("times", "normal");
      doc.text(name || "_____________", centerX + 50, 400);

      doc.setFont("times", "bold");
      doc.text("Roll No:", centerX - 50, 420, { align: "right" });
      doc.setFont("times", "normal");
      doc.text(roll || "_____________", centerX + 50, 420);

      doc.setFont("times", "bold");
      doc.text("Submitted To:", centerX - 50, 460, { align: "right" });
      doc.setFont("times", "normal");
      doc.text(teacher || "_____________", centerX + 50, 460);

      doc.setFontSize(10);
      doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 30, { align: "center" });

      doc.addPage();
      pageNumber++;
    }

    // ========= Simple PDF Mode =========
    const margin = 60;
    const lineHeight = 18;
    const maxY = pageHeight - 60;
    let cursorY = margin;

    if (mode === "simple" && title) {
      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text(title, pageWidth / 2, cursorY, { align: "center" });
      cursorY += 40;
    }

    const formattedLines = content.split("\n");

    for (const line of formattedLines) {
      let textParts = line.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__)/g);
      for (const part of textParts) {
        let fontType = "normal";
        let text = part;

        if (part.startsWith("**") && part.endsWith("**")) {
          fontType = "bold";
          text = part.replace(/\*\*/g, "");
        } else if (part.startsWith("*") && part.endsWith("*")) {
          fontType = "italic";
          text = part.replace(/\*/g, "");
        } else if (part.startsWith("__") && part.endsWith("__")) {
          fontType = "underline";
          text = text.replace(/__/g, "");
        }

        const wrappedText = doc.splitTextToSize(text, pageWidth - 2 * margin);
        for (const t of wrappedText) {
          if (cursorY > maxY) {
            doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 30, { align: "center" });
            doc.addPage();
            pageNumber++;
            cursorY = margin;
          }

          if (fontType === "bold") doc.setFont("times", "bold");
          else if (fontType === "italic") doc.setFont("times", "italic");
          else doc.setFont("times", "normal");

          doc.text(t, margin, cursorY);

          if (fontType === "underline") {
            const textWidth = doc.getTextWidth(t);
            doc.line(margin, cursorY + 2, margin + textWidth, cursorY + 2);
          }

          cursorY += lineHeight;
        }
      }
      cursorY += lineHeight / 2;
    }

    doc.setFontSize(10);
    doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 30, { align: "center" });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <h1 className="text-3xl font-bold text-center">Text to PDF Generator (Offline Dual Mode)</h1>

      {/* Mode Selector */}
      <div className="flex items-center gap-2">
        <label className="font-semibold">Select Mode:</label>
        <select
          className="border p-2 rounded"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="assignment">Assignment Mode</option>
          <option value="simple">Simple PDF Mode</option>
        </select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {mode === "assignment" && (
          <>
            <input
              className="border p-2 rounded"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Roll Number"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Department"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Teacher Name"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            />
          </>
        )}
        <input
          className="border p-2 rounded"
          placeholder="Custom File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>

      <textarea
        className="border w-full max-w-3xl h-64 p-2 rounded"
        placeholder="Write your content here... (Use **bold**, *italic*, __underline__)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <button
        onClick={generatePDF}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download PDF
      </button>

      {/* ====== Footer with Faisal's Name & Photo ====== */}
      <div className="mt-8 flex flex-col items-center space-y-2">
        <img
          src={MY_PHOTO}
          alt="Faisal Hayat"
          className="w-24 h-24 rounded-full border-2 border-blue-600"
        />
        <p className="font-bold text-lg text-center">Created-by Faisal Hayat</p>
      </div>
    </div>
  );
}
