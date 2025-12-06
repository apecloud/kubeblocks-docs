import { z } from 'zod';

export const ConstactUsFields = {
  username: z.string().min(1),
  email: z
    .string()
    .email()
    .refine((email) => {
      const domain = email.split('@')[1];
      return !['qq.com', 'gmail.com', '163.com', '126.com'].includes(domain);
    }),
  company: z.string().optional(),
  messages: z.string().max(300).optional(),
  url: z.string().optional(),
  title: z.string().optional(),
};
export const ContactUsSchema = z.object(ConstactUsFields);
