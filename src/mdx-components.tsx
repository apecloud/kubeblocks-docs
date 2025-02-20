import type { MDXComponents } from "mdx/types";
import { Link } from "@/components/Link";
import Image, { ImageProps } from "next/image";
import _ from "lodash";

import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

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
    h1: (props) => <h1 {...props} id={_.kebabCase(props.children)} />,
    h2: (props) => <h2 {...props} id={_.kebabCase(props.children)} />,
    h3: (props) => <h3 {...props} id={_.kebabCase(props.children)} />,
    h4: (props) => <h4 {...props} id={_.kebabCase(props.children)} />,
    h5: (props) => <h5 {...props} id={_.kebabCase(props.children)} />,
    h6: (props) => <h6 {...props} id={_.kebabCase(props.children)} />,
    ...components,
  };
}
