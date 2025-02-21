import type { MDXComponents } from "mdx/types";
import { Link } from "@/components/Link";
import Image, { ImageProps } from "next/image";
import _ from "lodash";


import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import NoteBox from "./components/NoteBox";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children }) => {
      return <Link href={href}>{children}</Link>;
    },
    img: (props: ImageProps) => (
      <Image
        style={{ maxWidth: "100%", height: "auto" }}
        width={props.width || 500}
        {...props}
        alt={props.alt}
      />
    ),
    table: (props) => <Table {...props} />,
    thead: (props) => <TableHead {...props} />,
    tbody: (props) => <TableBody {...props} />,
    tr: (props) => <TableRow {...props} />,
    td: (props) => <TableCell {...props} />,
    th: (props) => <TableCell {...props} />,
    code: (props) => {
      return (
        <code style={{ fontSize: "0.9em" }} {...props}>
          {props.children}
        </code>
      );
    },
    hr: (props) => <Divider {...props} sx={{ marginBlock: 2 }} />,
    p: (props) => <Typography {...props} sx={{ marginBlock: 2 }} />,
    div: (props) => {
      if(props.className === 'tip') {
        return <NoteBox type="success" title="TIP">{props.children}</NoteBox>
      }
      if(props.className === 'note') {
        return <NoteBox type="info" title="NOTE">{props.children}</NoteBox>
      }
      if(props.className === 'warning') {
        return <NoteBox type="warning" title="WARNING">{props.children}</NoteBox>
      }
      if(props.className === 'caution') {
        return <NoteBox type="error" title="CAUTION">{props.children}</NoteBox>
      }
      return <Box {...props} />
    },
    blockquote: (props) => <NoteBox {...props} />,
    ...components,
  };
}
