import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { h } from "hastscript";
import { visit } from "unist-util-visit";
import _ from "lodash";

import remarkGfm from "remark-gfm";
import remarkHeaderId from "remark-heading-id";
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

import rehypeHighlight from "rehype-highlight";
import rehypeToc from "@jsdevtools/rehype-toc";

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  webpack: (config) => {
    Object.assign(config.resolve.alias, {
      "@theme/Tabs": "@/components/MdxTabs",
      "@theme/TabItem": "@/components/MdxTabItem",
    });
    return config;
  },
  basePath: '',
  // output: 'export',
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      remarkMdxFrontmatter,
      remarkGithubAdmonitionsToDirectives,
      remarkDirective,
      () => {
        return (tree) => {
          visit(tree, (node) => {
            if (
              node.type === "containerDirective" &&
              _.includes(["note", "warning", "caution", "tip"], node.name)
            ) {
              const data = node.data || (node.data = {});
              const tagName = "div";
              data.hName = tagName;
              data.hProperties = h(tagName, {
                ...node.attributes,
                class: node.name,
              }).properties;
            }
          });
        };
      },
      [
        remarkHeaderId,
        {
          defaults: true,
        },
      ],
    ],
    rehypePlugins: [rehypeHighlight, [rehypeToc, {
      headings: ["h2", "h3", "h4", "h5", "h6"]
    }]],
  },
});

// Merge config with Next.js config
export default withMDX(nextConfig);
