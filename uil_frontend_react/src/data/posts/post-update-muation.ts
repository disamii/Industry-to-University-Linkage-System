import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/utils.axios";
import { toFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PostResponse } from "@/types/interfaces.posts";
import { postKeys } from "./keys";
import { postUrls } from "./urls";
import { PostUpdateInput } from "@/validation/validation.posts";

export const PostUpdate = async ({
  id,
  data,
}: {
  id?: number;
  data: PostUpdateInput;
}): Promise<PostResponse> => {
  if (!id) {
    throw new Error("ID is required for update");
  }

  const formData = toFormData(data);

  return safeApiRequest(
    api.patch<PostResponse>(postUrls.byId(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

export const usePostUpdateMutation = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => PostUpdate({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all() });
      toast.success("Post updated successfully");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to update post"),
  });
};
