const base = "industry_linkage/request-manages";

export const industryRequestOfficeUrls = {
  base: () => `${base}/`,
  byId: (id: number) => `${base}/${id}/`,
  perform_action: (request_id: number) => `${base}/${request_id}/actions/`,
  alter_action: (action_id: number) =>
    `${base}/actions/${action_id}/alter_action/`,
};
