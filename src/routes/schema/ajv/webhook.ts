// Redemption Codes Schema
import {typeObject, typeStringMaxLen, typeNumber, typeString, typeArray} from "@/util/fastify-schema-helper";

export const redemptionCodesSchema = typeObject({
    properties: {
        discount_type: typeStringMaxLen(), // required string
        redeem_code: typeStringMaxLen(),   // required string
        source: typeStringMaxLen(),          // required string
    },
});

// Transaction Total Amount Breakdown Schema
export const transactionTotalAmountBreakdownSchema = typeObject({
    properties: {
        subtotal: typeNumber,             // required number
        service_charge: typeNumber,       // optional
        shipping_fee: typeNumber,         // optional
        discount: typeNumber,             // optional
    },
});

// Transaction Total Amount Schema
export const transactionTotalAmountSchema = typeObject({
    properties: {
        value: typeNumber,                // required
        currency: typeStringMaxLen(),     // required
        breakdown: transactionTotalAmountBreakdownSchema, // optional
    },
});

// Address Schema
export const addressSchema = typeObject({
    properties: {
        line1: typeString,
        line2: typeString,
        city: typeString,
        state: typeString,
        zip_code: typeString,
        country_code: typeString,
    },
});

// Customer Schema
export const customerSchema = typeObject({
    properties: {
        first_name: typeStringMaxLen(),  // required
        middle_name: typeString,           // optional
        last_name: typeStringMaxLen(),     // required
        email: typeString,                 // optional
        mobile: typeString,                // optional
        address: addressSchema,            // optional
    },
});

// Transaction Schema
export const transactionSchema = typeObject({
    properties: {
        id: typeStringMaxLen(),            // required
        ref_no: typeStringMaxLen(),        // required
        type: typeStringMaxLen(),          // required
        status: typeStringMaxLen(),        // required
        amount: typeNumber,                // required
        subtotal: typeNumber,              // required
        metadata: typeObject({ properties: {} }), // object; adjust as needed
        created_at: typeString,            // ISO date string representation
        redemption_codes: typeArray(redemptionCodesSchema), // array of redemption codes
        original_total_amount: transactionTotalAmountSchema, // required
        customer: customerSchema,          // required
        partner_id: typeStringMaxLen(),    // required
        partner_ref_id: typeStringMaxLen(),// required
    },
});

// Special Payment Method Payment Schema
export const specialPaymentMethodPaymentSchema = typeObject({
    properties: {
        status: typeStringMaxLen(),           // required
        payment_date: typeString,             // required; ISO date string
        amount: typeNumber,                   // required
        gateway: typeStringMaxLen(),          // required
        gateway_txn_id: typeStringMaxLen(),   // required
        gateway_txn_ref_no: typeStringMaxLen(), // required
        gateway_txn_raw: typeObject({ properties: {} }), // required
        gateway_payment_method: typeStringMaxLen(), // required
        gateway_payment_scheme: typeStringMaxLen(), // required
    },
});

// Payload Schema
export const payloadSchema = typeObject({
    properties: {
        transaction: transactionSchema, // required transaction schema
        payment: specialPaymentMethodPaymentSchema, // required payment schema
    },
});

