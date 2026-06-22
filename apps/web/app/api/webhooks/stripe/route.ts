import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@nova-studio/database";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

function getWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || "";
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(payload, signature, getWebhookSecret());
  } catch (err: any) {
    console.error(`Stripe webhook error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "invoice.payment_succeeded": {
        const stripeInvoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice ${stripeInvoice.id} paid`);

        await prisma.invoice.updateMany({
          where: { stripeInvoiceId: stripeInvoice.id },
          data: { status: "PAID", paidAt: new Date() },
        });
        break;
      }
      case "invoice.payment_failed": {
        const stripeInvoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice ${stripeInvoice.id} payment failed`);

        await prisma.invoice.updateMany({
          where: { stripeInvoiceId: stripeInvoice.id },
          data: { status: "OVERDUE" },
        });
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout session ${session.id} completed`);

        const ticketId = session.metadata?.ticketId;
        if (ticketId) {
          await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: "IN_PROGRESS" },
          });

          await prisma.ticketStatusLog.create({
            data: {
              ticketId,
              fromStatus: "VERIFIED",
              toStatus: "IN_PROGRESS",
              changedBy: "system",
              note: "Paiement reçu via Stripe Checkout",
            },
          });
        }

        const invoiceId = session.metadata?.invoiceId;
        if (invoiceId) {
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
              status: "PAID",
              paidAt: new Date(),
            },
          });
        }
        break;
      }
      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
