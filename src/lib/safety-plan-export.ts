// Client-side safety plan export: download as PDF, or share via the device
// share sheet. Everything is generated in the browser from device-local data —
// nothing is uploaded.

type Field = { id: string; label: string; type?: "text" | "textarea" | "yesno" };
type Section = { id: string; tab: string; title: string; blurb: string; fields: Field[] };

function buildPlanSections(sections: Section[], values: Record<string, string>) {
  return sections.map((s) => ({
    title: s.title,
    tab: s.tab,
    fields: s.fields
      .map((f) => ({ label: f.label, answer: (values[f.id] ?? "").trim() }))
      .filter((f) => f.answer),
  }));
}

function buildPlanText(sections: Section[], values: Record<string, string>) {
  const lines: string[] = [
    "My Safety Plan — MrsANONymous",
    "Filled: " + new Date().toLocaleString(),
    "",
  ];
  for (const section of buildPlanSections(sections, values)) {
    lines.push("== " + section.title + " ==");
    for (const f of section.fields) {
      lines.push(f.label);
      for (const row of f.answer.split("\n")) lines.push("  " + row);
      lines.push("");
    }
  }
  return lines.join("\n");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

async function buildPlanPdf(sections: Section[], values: Record<string, string>): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 54;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("My Safety Plan", margin, y + 10);
  y += 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("MrsANONymous · filled " + new Date().toLocaleString(), margin, y);
  y += 22;
  doc.setTextColor(0);

  for (const section of buildPlanSections(sections, values)) {
    ensureSpace(46);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(section.title, margin, y);
    y += 18;
    doc.setDrawColor(220, 40, 80);
    doc.setLineWidth(1);
    doc.line(margin, y, margin + 64, y);
    y += 12;

    doc.setFontSize(10);
    for (const f of section.fields) {
      const labelLines = doc.splitTextToSize(f.label, maxW) as string[];
      ensureSpace(labelLines.length * 12 + 6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60);
      doc.text(labelLines, margin, y);
      y += labelLines.length * 12;
      doc.setTextColor(0);
      const answerLines = doc.splitTextToSize(f.answer, maxW) as string[];
      for (const line of answerLines) {
        ensureSpace(14);
        doc.setFont("helvetica", "normal");
        doc.text(line, margin + 12, y);
        y += 13;
      }
      y += 8;
    }
    y += 10;
  }

  doc.setProperties({ title: "My Safety Plan — MrsANONymous" });
  return doc.output("blob");
}

export async function downloadPlan(sections: Section[], values: Record<string, string>) {
  const pdf = await buildPlanPdf(sections, values);
  downloadBlob(pdf, "my-safety-plan.pdf");
}

export async function sharePlan(sections: Section[], values: Record<string, string>) {
  const name = "my-safety-plan.pdf";
  if (typeof navigator.share === "function" && typeof navigator.canShare === "function") {
    const pdf = await buildPlanPdf(sections, values);
    const file = new File([pdf], name, { type: "application/pdf" });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "My Safety Plan",
          text: "My safety plan (keep this private).",
        });
        return "shared";
      } catch (e) {
        if ((e as DOMException).name === "AbortError") return "cancelled";
        // fall through to download
      }
    }
  }
  await downloadPlan(sections, values);
  return "downloaded";
}

export function copyPlanText(sections: Section[], values: Record<string, string>) {
  return navigator.clipboard?.writeText(buildPlanText(sections, values));
}
