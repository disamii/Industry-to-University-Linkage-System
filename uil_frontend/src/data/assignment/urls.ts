const base = `/assignemnt`;

export const assignmentUrls = {
  base: () => base,
  byId: (id: string) => `${base}/${id}`,
  my: () => `${base}/my`,
  byRequestId: (request_id: string) => `${base}/by-request-id/${request_id}`,
};
