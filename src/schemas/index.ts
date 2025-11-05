import { z } from 'zod';

export const ConstactUsFields = {
  username: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  messages: z.string().max(300).optional(),
  url: z.string().optional(),
  title: z.string().optional(),
};
export const ContactUsSchema = z.object(ConstactUsFields);
