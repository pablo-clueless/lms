import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Invoice, Subscription, QueryParams, GenerateInvoice, Pagination } from "@/types";
import { apiClient } from "../api-client";

interface InvoiceQueries {
  limit?: number;
  page?: number;
  status?: "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "VOID" | "DISPUTED";
  tenant_id?: string;
}

interface PayInvoiceDto {
  payment_reference: string;
  payment_method: string;
}

interface BillingMetrics {
  total_revenue: number;
  mrr: number;
  upcoming_payments: number;
  late_payments: number;
  upcoming_count: number;
  late_count: number;
  recent_invoices: Invoice[];
}

const keys = {
  all: ["billing"] as const,
  generate: () => [...keys.all, "generate"],
  download: (id: string) => [...keys.all, "generate-pdf", id],
  invoices: () => [...keys.all, "invoices"],
  invoice: (id: string) => [...keys.all, "invoice", id],
  subscriptions: () => [...keys.all, "subscriptions"],
  subscription: (id: string) => [...keys.all, "subscription", id],
  metrics: () => [...keys.all, "metrics"],
  pay: () => [...keys.all, "pay-invoice"],
};

interface GenerateInvoiceResponse {
  total_tenants: number;
  invoices_created: number;
  skipped: number;
  failed: number;
  results: GenerateInvoice[];
}

interface ListInvoiceResponse {
  data: Invoice[];
  pagination: Pagination;
}

interface ListSubscriptionResponse {
  data: Subscription[];
}

const billingApi = {
  generateInvocies: () => apiClient.post<GenerateInvoiceResponse>("/billing/invoices/generate"),
  downloadInvoice: (id: string) => apiClient.getBlob(`/billing/invoices/${id}/pdf`),
  listInvoices: (params?: InvoiceQueries) =>
    apiClient.get<ListInvoiceResponse>("/billing/invoices", params as QueryParams),
  getInvoice: (id: string) => apiClient.get<Invoice>(`/billing/invoices/${id}`),
  payInvoice: (id: string, body: PayInvoiceDto) => apiClient.post<Invoice>(`/billing/invoices/${id}/pay`, body),
  listSubscriptions: () => apiClient.get<ListSubscriptionResponse>("/billing/subscriptions"),
  getSubscription: (id: string) => apiClient.get<Subscription>(`/billing/subscriptions/${id}`),
  getMetrics: () => apiClient.get<BillingMetrics>("/billing/metrics"),
};

export function useGenerateInvoices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.generate(),
    mutationFn: () => billingApi.generateInvocies(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.invoices() });
      queryClient.invalidateQueries({ queryKey: keys.metrics() });
    },
  });
}

export function useDownloadInvoice(id: string) {
  return useQuery({
    queryKey: keys.download(id),
    queryFn: () => billingApi.downloadInvoice(id),
    enabled: false,
  });
}

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
