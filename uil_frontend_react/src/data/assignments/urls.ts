const base = `/industry_linkage/assignments`;

export const assignmentUrls = {
  base: () => `${base}/`,
  byId: (id: number) => `${base}/${id}/`,
  remove_users: (assignment_id: number) =>
    `${base}/${assignment_id}/remove-users/`,
  add_users: (assignment_id: number) => `${base}/${assignment_id}/add-users/`,
};
