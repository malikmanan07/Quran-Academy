import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Full name is required')
      .min(3, 'Name must be at least 3 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^(\+92|0)?3\d{9}$/, 'Invalid Pakistani phone number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    role: z.enum(['student', 'teacher', 'parent'], {
      errorMap: (issue, ctx) => {
        if (issue.code === 'invalid_enum_value') return { message: 'Please select a valid role' };
        return { message: ctx.defaultError };
      },
    }),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
});

// Backward compatibility
export const validateLogin = (values) => {
  const result = loginSchema.safeParse(values);
  if (result.success) return {};
  const errors = {};
  result.error.errors.forEach((e) => {
    errors[e.path[0]] = e.message;
  });
  return errors;
};

export const validateRegister = (values) => {
  const result = signupSchema.safeParse(values);
  if (result.success) return {};
  const errors = {};
  result.error.errors.forEach((e) => {
    errors[e.path[0]] = e.message;
  });
  return errors;
};
