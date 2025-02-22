import path from "path";
import fs from "fs";
import readYamlFile from "read-yaml-file";
import grayMatter from "gray-matter";
import { SidebarMenuItem } from '@/components/SidebarMenu';

export const ROOT_DIR = process.cwd();
export const DOCS_DIR = path.join(ROOT_DIR, "docs");
export const MARKDOWN_SUEFIX_REG = /\.(md|mdx)$/;

export type MarkdownPageParams = {
  version: string;
  category: string;
  paths: string[];
};

const insertStr = (str: string, index: number, insertStr: string) => {
  return str.substring(0, index) + insertStr + str.substring(index);
}

export const getMarkDownSideBar = async (dir: string) => {
  const fns: Promise<SidebarMenuItem>[] = [];
  fs.readdirSync(dir).forEach((child) => {
    const filepath = path.join(dir, child);
    const stat = fs.lstatSync(filepath);
    const item: SidebarMenuItem = { position: 0 };
    if (stat.isFile() && filepath.match(MARKDOWN_SUEFIX_REG)) {
      fns.push(
        new Promise(async (resolve) => {
          const metadata = await getMarkDownMetaData(filepath);
          const urlPath = filepath.replace(DOCS_DIR, "").replace(MARKDOWN_SUEFIX_REG, "");
          Object.assign(item, {
            position: metadata.sidebar_position || metadata.position || 0,
            label: metadata.title || metadata.sidebar_label,
            href: insertStr(urlPath, 3, '/docs'),
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
