#!/bin/bash

REPO_URL="https://github.com/apecloud/kubeblocks.git"
API_REFERENCE_DOCS_DIR="docs/developer_docs/api-reference"
CLONE_DIR="kubeblocks-tmp"

# parse branch from args, default to main
BRANCH=${1:-main}

rm -rf docs/en/preview/user_docs/references/api-reference/*.mdx

# check out kubeblocks repo of branch main and copy docs/developer_docs/api-reference to docs/en/preview/user_docs/references/api-reference
git clone -b "$BRANCH" "$REPO_URL" "$CLONE_DIR"

cd "$CLONE_DIR" && make api-doc &&cd ..

cp -r $CLONE_DIR/$API_REFERENCE_DOCS_DIR/*.md docs/en/preview/user_docs/references/api-reference
rm -rf "$CLONE_DIR"