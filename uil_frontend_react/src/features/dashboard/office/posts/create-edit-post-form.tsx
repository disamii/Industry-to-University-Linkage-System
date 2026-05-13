import {
  FormCombobox,
  FormInput,
  FormTextArea,
  FormUploadFile,
} from "@/components/reusable/form-components";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePostCreateMutation } from "@/data/posts/post-create-mutation";
import { usePostUpdateMutation } from "@/data/posts/post-update-muation";
import { PostType } from "@/lib/enums";
import { formatSelectOptions } from "@/lib/utils";
import { PostDetailResponse } from "@/types/interfaces.posts";
import {
  PostCreateInput,
  postCreateSchema,
  postDefaultValues,
  PostUpdateInput,
  postUpdateSchema,
} from "@/validation/validation.posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type Props = {
  postToEdit?: PostDetailResponse;
};

const CreateEditPostForm = ({ postToEdit }: Props) => {
  const navigate = useNavigate();

  const isEditing = !!postToEdit;

  const { mutate: createMutation, isPending: isCreating } =
    usePostCreateMutation();
  const { mutate: updateMutation, isPending: isUpdating } =
    usePostUpdateMutation(postToEdit?.id);

  const defaultValues = useMemo(() => {
    if (isEditing && postToEdit) return postToEdit;

    return postDefaultValues;
  }, [postToEdit, isEditing]);

  const form = useForm<PostCreateInput | PostUpdateInput>({
    resolver: zodResolver(postCreateSchema || postUpdateSchema),
    defaultValues,
  });

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = (data: PostCreateInput | PostUpdateInput) => {
    const mutation = isEditing ? updateMutation : createMutation;

    mutation(data, {
      onSuccess: () => {
        if (!isEditing) form.reset();
        navigate("/dashboard/office/posts");
      },
    });
  };

  return (
    <form
      id="form-create-edit-post"
      onSubmit={form.handleSubmit(onSubmit)}
      className="items-end gap-6 grid grid-cols-3"
    >
      <div className="col-span-full">
        <FormInput
          form={form}
          name="title"
          label="Post Title"
          placeholder="e.g. New Industry Partnership"
          required
        />
      </div>

      <div className="col-span-full">
        <FormTextArea
          form={form}
          name="content"
          label="Content"
          placeholder="Write your post body here..."
          className="min-h-50"
          required
        />
      </div>

      <FormCombobox
        form={form}
        name="post_type"
        label="Type"
        options={formatSelectOptions(Object.values(PostType))}
        required
      />

      <FormInput
        form={form}
        name="expires_at"
        label="Expiry Date"
        type="date"
      />

      <div className="flex gap-4 bg-muted/50 p-3 rounded-md">
        <FormInput
          form={form}
          type="checkbox"
          name="is_published"
          label="Publish Immediately"
        />

        <FormInput
          form={form}
          type="checkbox"
          name="is_internal_only"
          label="Internal Only"
        />
      </div>

      <div className="col-span-full">
        <FormUploadFile
          form={form}
          name="image"
          label="Cover Image"
          accept="image/*"
          maxSizeMB={2}
        />
      </div>

      <Button
        type="submit"
        form="form-create-edit-post"
        disabled={isSubmitting}
        className="col-span-full w-full h-10"
      >
        {isSubmitting && <Spinner data-icon="inline-start" />}
        {isSubmitting
          ? "Processing..."
          : isEditing
            ? "Update Post"
            : "Create Post"}
      </Button>
    </form>
  );
};

export default CreateEditPostForm;
