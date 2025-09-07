import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_layout/envelope")({
  component: EnvelopePage,
});

function EnvelopePage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-80 h-56 bg-emerald-700 rounded-md shadow-lg overflow-hidden">
        {/* Top flap */}
        <div
          className={`absolute top-0 left-0 w-0 h-0 border-l-[160px] border-r-[160px] border-b-[90px] border-l-transparent border-r-transparent border-b-emerald-800 origin-top transform transition-transform duration-700 ${
            isOpen ? "rotate-x-180" : "rotate-x-0"
          }`}
          style={{ transformStyle: "preserve-3d" }}
        ></div>

        {/* Content revealed inside */}
        <div
          className={`absolute inset-0 flex items-center justify-center text-white text-lg font-semibold transition-opacity duration-700 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          ✉️ You’ve opened the envelope!
        </div>

        {/* Seal logo */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <img
            src="/NEB-Logo.png"
            alt="NEB Logo Seal"
            className="w-16 h-16 rounded-full border-4 border-emerald-900 bg-white shadow-md cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
}
