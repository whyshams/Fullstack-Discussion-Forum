import { apiSlice } from "./apiSlice";
const USER_URL = "/api/v2/user";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    logoutApi: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
    }),
    registerer: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getUser: builder.mutation({
      query: (userId) => ({
        url: `${USER_URL}/profile/${userId}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/delete`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useLoginMutation,
  useLogoutApiMutation,
  useRegistererMutation,
} = usersApiSlice;
