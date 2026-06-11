import { queryOptions } from "@tanstack/react-query";
import { getTransactions, getCategories, getProfile } from "./db.functions";

export const transactionsQueryOptions = queryOptions({
  queryKey: ["transactions"],
  queryFn: () => getTransactions(),
});

export const categoriesQueryOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: () => getCategories(),
});

export const profileQueryOptions = queryOptions({
  queryKey: ["profile"],
  queryFn: () => getProfile(),
});
