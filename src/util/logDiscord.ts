import axios, {AxiosError} from "axios";
import {DISCORD_WEBHOOK_URL} from "@/config";
import {IPayload} from "@/routes/schema/webhook"
import {catchError, from, map, throwError} from "rxjs";
import logger from "@/util/logger";
import {formatStringDate} from "@/util/utils";


function logDiscord(
    payload: IPayload
) {
    const {transaction, payment} = payload

    const customer = transaction.customer;
    const customerName = `${customer.first_name}${customer.middle_name ? ' ' + customer.middle_name : ''} ${customer.last_name}`;

    // Format customer address if available
    let addressStr = 'N/A';
    if (customer.address) {
        const { line1, line2, city, state, zip_code, country_code } = customer.address;
        addressStr = [line1, line2, city, state, zip_code, country_code]
            .filter(Boolean)
            .join(', ');
    }

    // Format redemption codes (if any)
    let redemptionCodesStr = 'N/A';
    if (transaction.redemption_codes && transaction.redemption_codes.length > 0) {
        redemptionCodesStr = transaction.redemption_codes
            .map(
                (code, index) =>
                    `**Code ${index + 1}:** ${code.redeem_code}\n• Discount Type: ${code.discount_type}\n• Source: ${code.source}`
            )
            .join('\n\n');
    }

    // Format original total amount breakdown if available
    let breakdownStr = 'N/A';
    let originalValue = 'N/A';
    if (transaction.original_total_amount && transaction.original_total_amount.breakdown) {
        if (transaction.original_total_amount.value) {
            originalValue = `${transaction.original_total_amount.value} ${transaction.original_total_amount?.currency || 'N/A'}`;
        }
        const { subtotal, service_charge, shipping_fee, discount } = transaction.original_total_amount.breakdown;
        breakdownStr = `Subtotal: ${subtotal}` +
            (service_charge ? `\nService Charge: ${service_charge}` : '') +
            (shipping_fee ? `\nShipping Fee: ${shipping_fee}` : '') +
            (discount ? `\nDiscount: ${discount}` : '');
    }

    // Safely stringify metadata (truncated if necessary)
    let metadataStr = 'N/A';
    try {
        metadataStr = JSON.stringify(transaction.metadata);
        if (metadataStr.length > 1024) {
            metadataStr = metadataStr.substring(0, 1021) + '...';
        }
    } catch {
        metadataStr = 'Unable to parse metadata';
    }

    // Safely stringify the gateway transaction raw data (truncated if necessary)
    let gatewayRawStr = 'N/A';
    try {
        gatewayRawStr = JSON.stringify(payment.gateway_txn_raw);
        if (gatewayRawStr.length > 1024) {
            gatewayRawStr = gatewayRawStr.substring(0, 1021) + '...';
        }
    } catch {
        gatewayRawStr = 'Unable to parse raw data';
    }

    // Build the Discord embed payload with two embeds.
    const embedData = {
        username: "Payment Webhook Bot", // Change as desired.
        embeds: [
            {
                title: "A Transaction Has Been Processed",
                color: 3447003, // Blue
                fields: [
                    { name: "Transaction ID", value: transaction.id, inline: true },
                    { name: "Reference No", value: transaction.ref_no, inline: true },
                    { name: "Type", value: transaction.type, inline: true },
                    { name: "Status", value: transaction.status, inline: true },
                    { name: "Amount", value: transaction.amount.toString(), inline: true },
                    { name: "Subtotal", value: transaction.subtotal.toString(), inline: true },
                    { name: "Created At", value: formatStringDate(transaction.created_at), inline: false },
                    { name: "Partner ID", value: transaction.partner_id, inline: true },
                    { name: "Partner Ref ID", value: transaction.partner_ref_id, inline: true },
                    {
                        name: "Original Total Amount",
                        value: originalValue,
                        inline: false
                    },
                    { name: "Amount Breakdown", value: breakdownStr, inline: false },
                    { name: "Metadata", value: metadataStr, inline: false },
                    { name: "Customer Name", value: customerName, inline: true },
                    { name: "Customer Contact", value: `${customer.email || 'N/A'}\n${customer.mobile || ''}`, inline: true },
                    { name: "Customer Address", value: addressStr, inline: false },
                    { name: "Redemption Codes", value: redemptionCodesStr, inline: false }
                ],
                timestamp: new Date().toISOString(),
                footer: { text: "Transaction Details" }
            },
            {
                title: "Payment Details",
                color: 3066993, // Green
                fields: [
                    { name: "Payment Status", value: payment.status, inline: true },
                    { name: "Payment Date", value: payment.payment_date, inline: true },
                    { name: "Amount", value: payment.amount.toString(), inline: true },
                    { name: "Gateway", value: payment.gateway, inline: true },
                    { name: "Gateway Txn ID", value: payment.gateway_txn_id, inline: true },
                    { name: "Gateway Ref No", value: payment.gateway_txn_ref_no, inline: true },
                    { name: "Payment Method", value: payment.gateway_payment_method, inline: true },
                    { name: "Payment Scheme", value: payment.gateway_payment_scheme, inline: true },
                    { name: "Gateway Raw", value: gatewayRawStr, inline: false }
                ],
                timestamp: new Date().toISOString(),
                footer: { text: "Payment Details" }
            }
        ]
    };

    const sendWebhook$ = from(axios({
        url: DISCORD_WEBHOOK_URL,
        method: "POST",
        data: embedData,
        headers: {
            "Content-Type": "application/json"
        }
    }))

    return sendWebhook$.pipe(
        map((response) => {
            logger.info(`Discord webhook sent successfully with status code ${response.status}: `, response.data)

            return response.data
        }),
        catchError((error: AxiosError) => {
            logger.error("Error sending Discord webhook: ", error)
            let status = "unknown";
            let responseData = null;

            if (error.response) {
                status = error.response.status.toString();
                responseData = error.response.data;
            } else if (error.request) {
                status = "no response";
            }
            return throwError({
                status,
                message: error.message,
                data: responseData
            })
        })
    )
}

export default logDiscord;