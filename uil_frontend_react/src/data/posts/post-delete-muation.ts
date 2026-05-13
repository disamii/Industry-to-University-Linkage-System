import api from "@/lib/axios";
import { bulkOperationHandler } from "@/lib/utils";
import { safeApiRequest } from "@/lib/utils.axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { postKeys } from "./keys";
import { postUrls } from "./urls";

export const postDelete = (ids: number[]) => {
  return bulkOperationHandler(ids, (id) =>
    safeApiRequest(api.delete(postUrls.byId(id))),
  );
};

export const usePostDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postDelete,
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all() });

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      if (failCount === 0) {
        toast.success(`${successCount} post(s) deleted successfully`);
      } else {
        toast.error(`${successCount} deleted, ${failCount} failed`);
      }
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to delete posts"),
  });
};
