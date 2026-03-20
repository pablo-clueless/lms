import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Pagination, Term } from "@/types";

const keys = {
  all: ["terms"] as const,
};

interface ListTermResponse {
  pagination: Pagination;
  term: Term[];
}

const termApi = {};
