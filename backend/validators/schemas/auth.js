const { z } = require('zod');

exports.loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

exports.refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }).optional().default({}),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

exports.changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(10),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
