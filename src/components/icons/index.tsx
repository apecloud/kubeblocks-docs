"use client";

import * as React from "react";

import "./iconfont.css";
import { Box, BoxProps } from "@mui/material";

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';


export const ApeCloudMySQLIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-apecloud-mysql" />
);
export const MySQLIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-mysql" />
);
export const KafkaIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-kafka" />
);
export const MilvusIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-milvus" />
);
export const MongodbIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-mongodb" />
);
export const PostgreSQLIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-postgresql" />
);
export const PulsarIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-pulsar" />
);
export const QdrantIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-qdrant" />
);
export const RabbitMQIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-rabbitmq" />
);
export const StarRocksIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-starrocks" />
);
export const ElasticSearchIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-elasticsearch" />
);
export const RedisIcon = (props: BoxProps) => (
  <Box {...props} className="iconfont icon-redis" />
);


export const SlackIconColor = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path fill="#E01E5A" d="M4.627 13.864a2.301 2.301 0 0 1 -2.305 2.304A2.301 2.301 0 0 1 0.018 13.864a2.301 2.301 0 0 1 2.304 -2.304h2.305zm1.152 0a2.301 2.301 0 0 1 2.304 -2.304 2.301 2.301 0 0 1 2.304 2.304v5.762a2.301 2.301 0 0 1 -2.304 2.304 2.301 2.301 0 0 1 -2.304 -2.304z"/>
    <path fill="#36C5F0" d="M8.084 4.61a2.301 2.301 0 0 1 -2.304 -2.305A2.301 2.301 0 0 1 8.084 0a2.301 2.301 0 0 1 2.304 2.304V4.611zm0 1.17a2.301 2.301 0 0 1 2.304 2.304 2.301 2.301 0 0 1 -2.304 2.304H2.304A2.301 2.301 0 0 1 0 8.085a2.301 2.301 0 0 1 2.304 -2.304z"/>
    <path fill="#2EB67D" d="M17.32 8.084a2.301 2.301 0 0 1 2.305 -2.304 2.301 2.301 0 0 1 2.304 2.304 2.301 2.301 0 0 1 -2.304 2.304h-2.305zm-1.152 0a2.301 2.301 0 0 1 -2.304 2.304 2.301 2.301 0 0 1 -2.305 -2.304V2.304A2.301 2.301 0 0 1 13.864 0a2.301 2.301 0 0 1 2.304 2.304z"/>
    <path fill="#ECB22E" d="M13.864 17.32a2.301 2.301 0 0 1 2.304 2.304 2.301 2.301 0 0 1 -2.304 2.305 2.301 2.301 0 0 1 -2.304 -2.305v-2.304zm0 -1.152a2.301 2.301 0 0 1 -2.304 -2.304 2.301 2.301 0 0 1 2.304 -2.304h5.78a2.301 2.301 0 0 1 2.304 2.304 2.301 2.301 0 0 1 -2.304 2.304z"/>
  </SvgIcon>
);

export const SlackIconNoColor = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path fill="currentColor" d="M4.623 13.901a2.317 2.317 0 0 1 -2.31 2.313A2.317 2.317 0 0 1 0 13.901a2.317 2.317 0 0 1 2.313 -2.309h2.31zm1.163 0a2.317 2.317 0 0 1 2.313 -2.309 2.317 2.317 0 0 1 2.309 2.309v5.787A2.317 2.317 0 0 1 8.099 22a2.319 2.319 0 0 1 -2.313 -2.313zm2.313 -9.278a2.317 2.317 0 0 1 -2.313 -2.31A2.319 2.319 0 0 1 8.099 0a2.317 2.317 0 0 1 2.309 2.313v2.31zm0 1.163a2.315 2.315 0 0 1 2.309 2.313 2.313 2.313 0 0 1 -2.309 2.309H2.313A2.317 2.317 0 0 1 0 8.099a2.319 2.319 0 0 1 2.313 -2.313zm9.278 2.313a2.317 2.317 0 0 1 2.31 -2.313A2.319 2.319 0 0 1 22 8.099a2.317 2.317 0 0 1 -2.313 2.309h-2.31zm-1.163 0a2.317 2.317 0 0 1 -2.313 2.309 2.317 2.317 0 0 1 -2.309 -2.309V2.313A2.317 2.317 0 0 1 13.901 0a2.317 2.317 0 0 1 2.313 2.313zm-2.313 9.278c1.279 0 2.31 1.035 2.313 2.31A2.317 2.317 0 0 1 13.901 22a2.317 2.317 0 0 1 -2.309 -2.313v-2.31zm0 -1.163a2.317 2.317 0 0 1 -2.309 -2.313 2.313 2.313 0 0 1 2.309 -2.309h5.787A2.317 2.317 0 0 1 22 13.901a2.317 2.317 0 0 1 -2.313 2.313z"/>
  </SvgIcon>
);


