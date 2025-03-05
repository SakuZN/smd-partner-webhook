interface IRedemptionCodes {
    discount_type: string;
    redeem_code: string;
    source: string;
}

interface ITransactionTotalAmountBreakdown {
    subtotal: number;
    service_charge?: number;
    shipping_fee?: number;
    discount?: number;
}

interface ITransactionTotalAmount {
    value: number;
    currency: string;
    breakdown?: ITransactionTotalAmountBreakdown;
}

interface IAddressSchema {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country_code?: string;
}

interface ICustomerSchema {
    first_name: string;
    middle_name?: string;
    last_name: string;
    email?: string;
    mobile?: string;
    address?: IAddressSchema;
}

interface ITransaction {
    id: string;
    ref_no: string;
    type: string;
    status: string;
    amount: number;
    subtotal: number;
    metadata: object;
    created_at: string;
    redemption_codes: IRedemptionCodes[];
    original_total_amount: ITransactionTotalAmount;
    customer: ICustomerSchema;
    partner_id: string;
    partner_ref_id: string;
}

interface ISpecialPaymentMethodPayment {
    status: string;
    payment_date: string;
    amount: number;
    gateway: string;
    gateway_txn_id: string;
    gateway_txn_ref_no: string;
    gateway_txn_raw: object;
    gateway_payment_method: string;
    gateway_payment_scheme: string;
}

export interface IPayload {
    transaction: ITransaction;
    payment: ISpecialPaymentMethodPayment;
}


export interface PostWebhookPayload {
    Body: IPayload;
}