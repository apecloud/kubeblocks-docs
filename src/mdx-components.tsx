import {
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Typography,
  Box,
  TableContainer,
} from "@mui/material";
import type { MDXComponents } from "mdx/types";
import { JSX } from "react";
import NoteBox from "./components/NoteBox";
import { Link } from "./components/Link";
import Sticky from "./components/Sticky";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    nav: (props: JSX.IntrinsicElements["nav"]) => {
      if (props.className === "toc") {
        return (
          <Sticky enabled={true} top={80} >
            <nav {...props} />
          </Sticky>
        );
      } else {
        return <nav {...props} />;
      }
    },
    a: (props: JSX.IntrinsicElements["a"]) => {
      const target = props.href?.match(/^http/) ? "_blank" : "_self";
      const url = props.href?.replace(/\.md/, "");
      const isNavLink = props.className?.includes("toc-link");
      return (
        <Tooltip
          title={props.children}
          placement={isNavLink ? "left" : "top"}
          arrow
        >
          <Link {...props} href={url || "/"} target={target} />
        </Tooltip>
      );
    },
    table: (props: JSX.IntrinsicElements["table"]) => (
      <TableContainer sx={{ marginBlock: 4 }}>
        <Table {...props} />
      </TableContainer>
    ),
    thead: (props: JSX.IntrinsicElements["thead"]) => <TableHead {...props} />,
    tbody: (props: JSX.IntrinsicElements["tbody"]) => <TableBody {...props} />,
    tr: (props: JSX.IntrinsicElements["tr"]) => <TableRow {...props} />,
    td: (props: JSX.IntrinsicElements["td"]) => (
      <TableCell>{props.children}</TableCell>
    ),
    th: (props: JSX.IntrinsicElements["th"]) => (
      <TableCell>{props.children}</TableCell>
    ),
    code: (props: JSX.IntrinsicElements["code"]) => {
      return (
        <code style={{ fontSize: "0.9em" }} {...props}>
          {props.children}
        </code>
      );
    },
    hr: (props: JSX.IntrinsicElements["hr"]) => (
      <Divider {...props} sx={{ marginBlock: 2 }} />
    ),
    p: (props: JSX.IntrinsicElements["p"]) => (
      <Typography {...props} sx={{ marginBlock: 2 }} />
    ),
    div: (props: JSX.IntrinsicElements["div"]) => {
      if (props.className === "tip") {
        return (
          <NoteBox type="success" title="TIP">
            {props.children}
          </NoteBox>
        );
      }
      if (props.className === "note") {
        return (
          <NoteBox type="info" title="NOTE">
            {props.children}
          </NoteBox>
        );
      }
      if (props.className === "warning") {
        return (
          <NoteBox type="warning" title="WARNING">
            {props.children}
          </NoteBox>
        );
      }
      if (props.className === "caution") {
        return (
          <NoteBox type="error" title="CAUTION">
            {props.children}
          </NoteBox>
        );
      }
      return <Box {...props} />;
    },
    blockquote: (props: JSX.IntrinsicElements["blockquote"]) => (
      <NoteBox {...props} />
    ),
    ...components,
  };
}
