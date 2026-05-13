const base = `/bulletin/posts`;

export const postUrls = {
  base: () => `${base}/`,
  byId: (id: number) => `${base}/${id}/`,
};
