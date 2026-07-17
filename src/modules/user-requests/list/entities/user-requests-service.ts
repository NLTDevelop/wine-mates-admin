import { api } from "@/services";
import { UserRequestFilters, UserRequestsResponse } from "./types";
import { USER_REQUESTS_ENDPOINTS } from "./user-requests-endpoints";
import { buildUrl } from "@/lib/utils";

export const userRequestListService = {
  list: (filters: UserRequestFilters | null): Promise<UserRequestsResponse> => api.get(USER_REQUESTS_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  delete: (id: string): Promise<void> => api.delete(buildUrl(USER_REQUESTS_ENDPOINTS.DELETE, { id })).then(response => response.data),
 }