
export function getEsewaConfig() {
  return {
    merchantId: process.env.ESEWA_MERCHANT_ID || "EPAYTEST",
    secret: process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q",
    successUrl: process.env.ESEWA_SUCCESS_URL || "http://localhost:5173/payment/success",
    failureUrl: process.env.ESEWA_FAILURE_URL || "http://localhost:5173/payment/failure",
    esewaPaymentUrl: process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    statusCheckUrl: process.env.ESEWA_STATUS_CHECK_URL || "https://uat.esewa.com.np/api/epay/transaction/status/"
  };
}

// Also export as default
export default getEsewaConfig;