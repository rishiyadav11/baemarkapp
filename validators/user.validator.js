const { z } = require("zod");

const userSignupValidator = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number is too long")
});

module.exports = {
    userSignupValidator
};
