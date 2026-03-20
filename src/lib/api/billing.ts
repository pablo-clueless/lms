import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Invoice, Subscription, QueryParams } from "@/types";
import { apiClient } from "../api-client";

interface InvoiceQueries {
  status?: "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "VOID" | "DISPUTED";
}

interface PayInvoiceDto {
  payment_reference: string;
  payment_method: string;
}

interface BillingMetrics {
  total_revenue: number;
  pending_amount: number;
  overdue_amount: number;
}

const keys = {
  all: ["billing"] as const,
  invoices: () => [...keys.all, "invoices"],
  invoice: (id: string) => [...keys.all, "invoice", id],
  subscriptions: () => [...keys.all, "subscriptions"],
  subscription: (id: string) => [...keys.all, "subscription", id],
  metrics: () => [...keys.all, "metrics"],
  pay: () => [...keys.all, "pay-invoice"],
};

interface ListInvoiceResponse {
  data: Invoice[];
}

interface ListSubscriptionResponse {
  data: Subscription[];
}

const billingApi = {
  listInvoices: (params?: InvoiceQueries) =>
    apiClient.get<ListInvoiceResponse>("/billing/invoices", params as QueryParams),
  getInvoice: (id: string) => apiClient.get<Invoice>(`/billing/invoices/${id}`),
  payInvoice: (id: string, body: PayInvoiceDto) => apiClient.post<Invoice>(`/billing/invoices/${id}/pay`, body),
  listSubscriptions: () => apiClient.get<ListSubscriptionResponse>("/billing/subscriptions"),
  getSubscription: (id: string) => apiClient.get<Subscription>(`/billing/subscriptions/${id}`),
  getMetrics: () => apiClient.get<BillingMetrics>("/billing/metrics"),
};

export function useGetInvoices(params?: InvoiceQueries) {
  return useQuery({
    queryKey: keys.invoices(),
    queryFn: () => billingApi.listInvoices(params),
  });
}

export function useGetInvoice(id: string) {
  return useQuery({
    queryKey: keys.invoice(id),
    queryFn: () => billingApi.getInvoice(id),
    enabled: !!id,
  });
}

export function usePayInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.pay(),
    mutationFn: ({ id, body }: { id: string; body: PayInvoiceDto }) => billingApi.payInvoice(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.invoices() });
      queryClient.invalidateQueries({ queryKey: keys.metrics() });
    },
  });
}

export function useGetSubscriptions() {
  return useQuery({
    queryKey: keys.subscriptions(),
    queryFn: () => billingApi.listSubscriptions(),
  });
}

export function useGetSubscription(id: string) {
  return useQuery({
    queryKey: keys.subscription(id),
    queryFn: () => billingApi.getSubscription(id),
    enabled: !!id,
  });
}

export function useGetBillingMetrics() {
  return useQuery({
    queryKey: keys.metrics(),
    queryFn: () => billingApi.getMetrics(),
  });
}
