# Introduction

This repo contains the source code of kubeblocks docs. It's built by [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), and you can use [MUI](https://mui.com/material-ui/all-components/) components directly in mdx files.

## Getting Started

Requirements:

* Install [Node.js](https://nodejs.org/en/download/) version >= 20.0.0, which can be checked by running `node -v`.
* yarn

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the docs by modifying `/docs`. The page auto-updates as you edit the file.


## The structure of files

```
kubeblocks-docs
└─blogs
│  └─en
│  │  │ blog_1.mdx
│  │  │ blog_2.mdx
│  │  │ ...
│
└─docs
│  └─ en
│  │  └─ preview
│  │  │    └─<topbar_category>
│  │  │        └─<sidebar_menu_1>
│  │  │        │    │ doc_1.mdx
│  │  │        │    │ doc_2.mdx
│  │  │        └─<sidebar_menu_2>
│  │  │             │ doc_1.mdx
│  │  │             │ doc_2.mdx
│  │  │
│  │  └─ release-0.9
└─reports                         # kubeblocks reports
│
└─publics
│   └──img                        # markdown assets
│
└─src                             # source code for enginer
│   └─app
│   └─components
│   └─locales
|   └─theme
│   └─...
│
│ README.md
│ packages.json
│ next.config.ts
```

## Deploy


### build

```bash
make docker-build TAG=main
```

```bash
docker run --name kubeblocks-docs -p 3000:3000 apecloud/kubeblocks-docs:main
```

### deploy & upgrade

```bash
helm upgrade --install kubeblocks-docs ./helm/kubeblocks-docs --set image.tag=main --set service.type=LoadBalancer --create-namespace -n kubeblocks-docs
```

```bash
kubectl port-forward svc/kubeblocks-docs 3000:3000 -n kubeblocks-docs
```