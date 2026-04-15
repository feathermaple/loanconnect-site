import { Suspense } from "react";
import PricingClient from "./PricingClient";

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="p-6">載入中...</div>}>
      <PricingClient />
    </Suspense>
  );
}