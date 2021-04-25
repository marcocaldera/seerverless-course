const schema = {
  type: "object",
  properties: {
    body: {
      type: "string",
      minLength: 1,
    },
  },
  required: ["body"],
};

export default schema;
