'use client';

import { ConstactUsFields, ContactUsSchema } from '@/schemas';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';
import _ from 'lodash';
import { message } from 'mui-message';
import React, { useState } from 'react';

type ContactUsProps = {
  username?: string;
  email?: string;
  company?: string;
  messages?: string;
  url?: string;
};

type ContactUsResponse = {
  success: boolean;
  errors: {
    username?: string[];
    email?: string[];
    company?: string[];
    messages?: string[];
    url?: string[];
  };
};

export const ContactUs = ({
  extra,
  ...props
}: ButtonProps & { extra?: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formData, setFormData] = useState<ContactUsProps>({
    username: '',
    email: '',
    company: '',
    messages: '',
  });
  const [isPending, setIsPending] = useState<boolean>(false);
  const [errors, setErrors] = useState<ContactUsResponse['errors']>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldSchema = _.get(ConstactUsFields, name);
    if (fieldSchema) {
      const { error } = fieldSchema.safeParse(value);
      setErrors({
        [name]: error ? error.flatten().formErrors : undefined,
      });
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // valid form data
    const { error } = ContactUsSchema.safeParse(formData);
    if (error) {
      setErrors(error.flatten().fieldErrors);
      return;
    }

    setIsPending(true);
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        title: props.title,
        url: window.location.href,
      }),
    });

    const res: ContactUsResponse = await response.json();

    if (res.success) {
      message.success(
        'Your message has been received, and we will respond via email.',
      );
      setOpen(false);
    } else {
      setErrors(res.errors);
    }
    setIsPending(false);
  };

  return (
    <>
      <Button {...props} onClick={handleOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <Stack
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
          }}
          direction="row"
          alignItems="center"
          spacing={2}
        >
          {extra}
          <IconButton onClick={handleClose}>
            <CloseIcon color="disabled" />
          </IconButton>
        </Stack>
        <form autoComplete="off" style={{ width: 560 }} onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={1.5}>
              <Stack spacing={1}>
                <InputLabel>First and Last Name</InputLabel>
                <OutlinedInput
                  type="text"
                  name="username"
                  value={formData?.username}
                  error={!_.isEmpty(errors?.username)}
                  onChange={handleChange}
                />
                <FormHelperText>{errors?.username?.[0]}</FormHelperText>
              </Stack>
              <Stack spacing={1}>
                <InputLabel>Email</InputLabel>
                <OutlinedInput
                  type="text"
                  name="email"
                  value={formData?.email}
                  placeholder='me@company.com'
                  error={!_.isEmpty(errors?.email)}
                  onChange={handleChange}
                />
                <FormHelperText>{errors?.email?.[0]}</FormHelperText>
              </Stack>
              <Stack spacing={1}>
                <InputLabel>Company</InputLabel>
                <OutlinedInput
                  name="company"
                  value={formData?.company}
                  error={!_.isEmpty(errors?.company)}
                  onChange={handleChange}
                />
                <FormHelperText>{errors?.company?.[0]}</FormHelperText>
              </Stack>
              <Stack spacing={1}>
                <InputLabel>Messages</InputLabel>
                <OutlinedInput
                  multiline
                  name="messages"
                  value={formData?.messages}
                  rows={3}
                  error={!_.isEmpty(errors?.messages)}
                  onChange={handleChange}
                />
                <FormHelperText>{errors?.messages?.[0]}</FormHelperText>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" disabled={isPending} type="submit">
              OK
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
