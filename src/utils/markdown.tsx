import path from "path";
import fs from "fs";
import readYamlFile from "read-yaml-file";
import grayMatter from "gray-matter";
import { SidebarMenuItem } from "@/components/SidebarMenu";
import moment from "moment";

export const ROOT_DIR = process.cwd();
export const DOCS_DIR = path.join(ROOT_DIR, "docs");
export const MARKDOWN_SUEFIX_REG = /\.(md|mdx)$/;

export type MarkdownPageParams = {
  locale: string;
  version: string;
  category: string;
  paths?: string[];
};

export const getFirstMenuItem = (
  items?: SidebarMenuItem[]
): SidebarMenuItem | undefined => {
  let result;
  try {
    items?.forEach((item) => {
      result = item.href ? item : getFirstMenuItem(item.children);
      if (result) throw new Error();
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {}
  return result;
};

export const getMarkDownSideBar = async (
  dir: string
): Promise<SidebarMenuItem[]> => {
  const fns: Promise<SidebarMenuItem>[] = [];
  fs.readdirSync(dir).forEach((child) => {
    const filepath = path.join(dir, child);
    const stat = fs.lstatSync(filepath);
    const item: SidebarMenuItem = { position: 0 };
    if (stat.isFile() && filepath.match(MARKDOWN_SUEFIX_REG)) {
      fns.push(
        new Promise(async (resolve) => {
          const metadata = await getMarkDownMetaData(filepath);
          const urlPath = filepath
            .replace(DOCS_DIR, "")
            .replace(MARKDOWN_SUEFIX_REG, "");
          Object.assign(item, {
            position: metadata.sidebar_position || metadata.position || 0,
            label: metadata.title || metadata.sidebar_label,
            href: urlPath.replace(/^\/(en|zh)/, "/docs"),
            description: metadata.description,
          });
          resolve(item);
        })
      );
    }
    if (stat.isDirectory()) {
      fns.push(
        new Promise(async (resolve) => {
          const configFile = fs
            .readdirSync(filepath)
            .find((f) => f.match(/^_category_/));
          if (configFile) {
            const config =
              (await readYamlFile(path.join(filepath, configFile))) || {};
            Object.assign(item, config);
          }
          const children = await getMarkDownSideBar(filepath);
          resolve({
            ...item,
            children,
          });
        })
      );
    }
  });
  return (await Promise.all(fns)).sort((a, b) => a.position - b.position);
};

export const getMarkDownMetaData = async (filepath: string) => {
  const isExists = fs.existsSync(filepath);
  if (isExists) {
    const { data } = grayMatter(fs.readFileSync(filepath, "utf8"));
    return data;
  } else {
    return {};
  }
};

export type BlogMetadata = {
  name: string,
  title: string,
  description: string,
  date: string,
  image: string,
  datetime: string,
  authors?: {
    image_url: string,
    name: string,
  }
}

export const getBlogs = async (currentLocale: string): Promise<BlogMetadata[]> => {
  let blogsDir = path.join(DOCS_DIR, currentLocale, "blogs");
  if (!fs.existsSync(blogsDir)) {
    blogsDir = path.join(DOCS_DIR, "en", "blogs");
  }
  moment.locale(currentLocale);
  const files = fs
    .readdirSync(blogsDir)
    .filter((file) => file.endsWith(".mdx"));

  const blogs = (
    await Promise.all(
      files.map(async (file) => {
        const data = (await getMarkDownMetaData(path.join(blogsDir, file))) as BlogMetadata;
        data.name = file.replace(/\.mdx$/, "");
        return data;
      })
    )
  )
    .map((blog) => {
      blog.datetime = moment(blog.date).format("LL");
      return blog;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return blogs;
};
