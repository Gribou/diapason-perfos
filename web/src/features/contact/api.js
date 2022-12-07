export default (builder) => ({
  contact: builder.mutation({
    query: (data) => ({
      url: "contact/",
      method: "POST",
      data,
    }),
  }),
});
