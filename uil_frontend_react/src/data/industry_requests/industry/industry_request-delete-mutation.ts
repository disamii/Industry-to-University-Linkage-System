import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";

export const industryRequestDelete = async (ids: number[]) => {
  const results: { id: number; success: boolean; error?: string }[] = [];

  for (const id of ids) {
    try {
      await safeApiRequest(api.delete(industryRequestUrls.byId(id)));
      results.push({ id, success: true });
    } catch (error: any) {
      results.push({
        id,
        success: false,
        error: error.message || "Failed",
      });
    }
  }

  return results;
};

export const useIndustryRequestDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: industryRequestDelete,
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: industryRequestKeys.all() });

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      if (failCount === 0) {
        toast.success(`${successCount} request(s) deleted successfully`);
      } else {
        toast.error(`${successCount} deleted, ${failCount} failed`);
      }
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to delete requests"),
  });
};
