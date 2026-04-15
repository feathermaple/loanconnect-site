import { Suspense } from "react";
import FakePaymentClient from "./FakePaymentClient";

export default function FakePaymentPage() {
  return (
    <Suspense fallback={<div className="p-6">載入中...</div>}>
      <FakePaymentClient />
    </Suspense>
  );
}