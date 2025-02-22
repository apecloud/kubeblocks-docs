import { Box, Typography } from "@mui/material";
import {
  IllustrationEmpty,
  IllustrationError,
  IllustrationNotFound,
} from "./Illustration";

export type ResultProps = {
  status: "error" | "empty" | "notfound" | "forbidden";
  title?: string;
  description?: string;
  actions?: React.ReactNode;
};

export const Result = ({
  status = "empty",
  title,
  description,
  actions,
}: ResultProps) => {
  let icon;
  switch (status) {
    case "empty":
      icon = <IllustrationEmpty />;
      break;
    case "error":
      icon = <IllustrationError />;
      break;
    case "notfound":
      icon = <IllustrationNotFound />;
      break;
    case "forbidden":
      icon = <IllustrationError />;
      break;
    default:
      icon = <IllustrationError />;
  }

  return (
    <Box textAlign="center" p={10}>
      <Box>{icon}</Box>
      {title ? (
        <Typography mt={2} variant="h4">
          {title}
        </Typography>
      ) : null}
      {description ? (
        <Typography mt={2} variant="subtitle1" color="textSecondary">
          {description}
        </Typography>
      ) : null}
      {actions ? <Box mt={4}>{actions}</Box> : null}
    </Box>
  );
};