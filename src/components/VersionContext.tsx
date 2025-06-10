"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { versionOptions, getVersionFromPath } from "@/constants/versions";

const VersionContext = createContext({
  version: versionOptions[0].value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setVersion: (v: string) => {},
  options: versionOptions,
});

// 递归替换 React 元素中的版本号
function replaceVersionInElement(element: React.ReactNode, version: string): React.ReactNode {
  if (typeof element === 'string') {
    return element.replace(/\{\{VERSION\}\}/g, version);
  }
  
  if (typeof element === 'number' || typeof element === 'boolean' || element == null) {
    return element;
  }
  
  if (Array.isArray(element)) {
    return element.map((child, index) => {
      const processedChild = replaceVersionInElement(child, version);
      // If it's a React element, add a key prop
      if (React.isValidElement(processedChild)) {
        return React.cloneElement(processedChild, { 
          key: processedChild.key || `version-replace-${index}`
        });
      }
      return processedChild;
    });
  }
  
  if (React.isValidElement(element)) {
    const props = element.props || {};
    const { children, ...otherProps } = props as { children?: React.ReactNode; [key: string]: unknown };
    
    // 替换 props 中的字符串值
    const newProps: { [key: string]: unknown } = { ...otherProps };
    Object.keys(newProps).forEach(key => {
      if (typeof newProps[key] === 'string') {
        newProps[key] = (newProps[key] as string).replace(/\{\{VERSION\}\}/g, version);
      }
    });
    
    // 递归处理 children
    const newChildren = children ? replaceVersionInElement(children, version) : children;
    
    return React.cloneElement(element, newProps, newChildren);
  }
  
  return element;
}

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [version, setVersion] = useState(versionOptions[0].value);

  // 自动从路径推断版本
  useEffect(() => {
    const inferredVersion = getVersionFromPath(pathname);
    setVersion(inferredVersion);
  }, [pathname]);

  // 使用 useMemo 缓存替换后的内容，避免不必要的重新渲染
  const processedChildren = useMemo(() => {
    if (!version) return children;
    return replaceVersionInElement(children, version);
  }, [children, version]);

  return (
    <VersionContext.Provider value={{ version, setVersion, options: versionOptions }}>
      {processedChildren}
    </VersionContext.Provider>
  );
};

// 版本显示组件
export const Version = () => {
  const { version } = useVersion();
  return <>{version}</>;
};

export const useVersion = () => useContext(VersionContext); 