import { apiSlice } from "./apiSlice";
const Base_Url = "/api/v2/posts";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPost: builder.mutation({
      query: (data) => ({
        url: `${Base_Url}/allpostapp`,
        method: "POST",
        body: data,
      }),
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: `${Base_Url}`,
        method: "POST",
        body: data,
      }),
    }),
    updatePost: builder.mutation({
      query: (data) => ({
        url: `${Base_Url}/edit`,
        method: "PUT",
        body: data,
      }),
    }),
    deletePost: builder.mutation({
      query: (data) => ({
        url: `${Base_Url}/delete`,
        method: "DELETE",
        body: data,
      }),
    }),
    singlePost: builder.mutation({
      query: (id) => ({
        url: `${Base_Url}/${id}`,
        method: "GET",
      }),
    }),
    userPosts: builder.mutation({
      query: (userId) => ({
        url: `${Base_Url}/${userId}/posts`,
        method: "GET",
      }),
    }),
    createComment: builder.mutation({
      query: (data) => ({
        url: `${Base_Url}/${data._id}/comments`,
        method: "POST",
        body: data,
      }),
    }),
    likePost: builder.mutation({
      query: (data) => ({
        url: `${Base_Url}/${data.postId}/like`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useLikePostMutation,
  useCreateCommentMutation,
  useUserPostsMutation,
  useSinglePostMutation,
  useGetAllPostMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postApiSlice;
