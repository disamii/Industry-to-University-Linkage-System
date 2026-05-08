const base = `/industry_linkage/assignments`;

export const assignmentUrls = {
  base: () => `${base}/`,
  byId: (id: number) => `${base}/${id}/`,
  remove_users: (assignment_id: number) =>
    `${base}/${assignment_id}/remove-users/`,
  add_users: (assignment_id: number) => `${base}/${assignment_id}/add-users/`,
  change_status: (assignment_id: number) =>
    `${base}/${assignment_id}/change-status/`,
  by_user_id: (user_id: number) => `${base}/by-user/${user_id}`,
};
