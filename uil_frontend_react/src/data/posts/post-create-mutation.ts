import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/utils.axios";
import { PostResponse } from "@/types/interfaces.posts";
import { PostCreateInput } from "@/validation/validation.posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toFormData } from "axios";
import toast from "react-hot-toast";
import { postUrls } from "./urls";
import { postKeys } from "./keys";

export const postCreate = (data: PostCreateInput) => {
  const formData = toFormData(data);

  return safeApiRequest(
    api.post<PostResponse>(postUrls.base(), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

export const usePostCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all() });
      toast.success("Post created successfully");
    },
    onError: (error: any) => toast.error(error.message || "Action failed"),
  });
};
