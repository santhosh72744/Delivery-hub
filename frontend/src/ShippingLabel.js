import React, { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ShippingLabel.css";

export default function ShippingLabel({
  courier,
  amount,
  pickup,
  toAddr,
  trackingNumber,
  paymentRef,
  onFinish,
}) {
  const barcodeRef = useRef(null);
  const labelRef = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fallback values if something missing
  const finalTracking = trackingNumber || "PMB-000000000";
  const finalPaymentRef = paymentRef || "PMB-PMT-00000000";

  // Render barcode
  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, finalTracking.replace("PMB-", ""), {
        format: "CODE128",
        width: 2,
        height: 55,
        displayValue: false,
      });
    }
  }, [finalTracking]);

  // Download PDF
  const handleDownload = async () => {
    const canvas = await html2canvas(labelRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${finalTracking}_Label.pdf`);
  };

  // Date
  const today = new Date();
  const shipDate = today
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
    .toUpperCase();

  return (
    <div className="label-wrapper">
      <div className="label-container" ref={labelRef}>

        {/* Header sender block */}
        <div className="row header">
          <div className="left">
            <p>ORIGIN ID: 1259372816</p>
            <p className="bold">SENDER NAME: {pickup?.name || "—"}</p>
            <p>{pickup?.address1 || "—"}</p>
            <p>
              {pickup?.city}, {pickup?.state} {pickup?.zip}
            </p>
            <p>Sender Contact: {pickup?.phone || "—"}</p>
          </div>

          <div className="right">
            <p>SHIP DATE: {shipDate}</p>
            <p>TOTAL WT: 0.5 KGS</p>
            <p>CURR: USD</p>
            <p>BILL SENDER</p>
          </div>
        </div>

        {/* To Address Block */}
        <div className="to-block">
          <p className="small">TO:</p>
          <p className="bold big">{toAddr?.name || "—"}</p>
          <p>{toAddr?.address1 || "—"}</p>
          <p>
            {toAddr?.city}, {toAddr?.state} {toAddr?.pin}
          </p>
          <p>Phone: {toAddr?.phone || "—"}</p>

          <p className="ref">PAYMENT REF: {finalPaymentRef}</p>
          <p className="ref">REF: {finalTracking}</p>
        </div>

        {/* Barcode + courier box */}
        <div className="barcode-row">
          <svg ref={barcodeRef}></svg>

          <div className="courier-box">
            <div className="courier-name">{courier?.toUpperCase()}</div>
            <div className="service-code">E</div>
          </div>
        </div>

        {/* QR Code */}
        <div className="qr">
          <QRCode value={finalTracking} size={75} />
        </div>

        {/* Big tracking number block */}
        <div className="tracking-big">
          <p className="trk">TRK#</p>
          <p className="big-num">{finalTracking.replace("PMB-", "")}</p>
          <p className="big-code">XQ HYDBG</p>
        </div>

        {/* Side info block */}
        <div className="side-info">
          <p>AA</p>
          <p>IP EOD</p>
          <p>ETD RES</p>
          <p className="bold zip">{toAddr?.pin}</p>
          <p>TS-IN</p>
        </div>

        {/* Amount */}
        <div className="amount-area">
          <p>Amount Paid</p>
          <p className="amt">₹{amount}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="bottom-buttons">
        <button className="download" onClick={handleDownload}>
          Download Label
        </button>

        <button className="done" onClick={() => setShowSuccess(true)}>
          Done
        </button>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="success-box">
          <h2>✅ Shipment Successful!</h2>
          <p>Your shipment has been placed successfully.</p>

          <div className="success-actions">
            <button className="close-btn" onClick={onFinish}>
              Close
            </button>

            <button className="new-btn" onClick={onFinish}>
              Start New Shipment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
