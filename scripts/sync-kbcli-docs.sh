#!/bin/bash

REPO_URL="https://github.com/apecloud/kbcli.git"
KBCLI_DOCS_DIR="docs/user_docs/cli"
CLONE_DIR="kbcli-tmp"

# parse branch from args, default to main
BRANCH=${1:-main}

# rm -rf docs/zh/preview/cli
rm -rf docs/en/preview/cli

# check out kbcli repo of branch v1.0.0 and copy docs/user_docs/cli to docs/zh/cli and docs/en/cli
git clone -b "$BRANCH" "$REPO_URL" "$CLONE_DIR"

cd "$CLONE_DIR" && rm -rf $KBCLI_DOCS_DIR && make kbcli-doc
cd ..
# cp -r "$CLONE_DIR/$KBCLI_DOCS_DIR" docs/zh/preview/cli
cp -r "$CLONE_DIR/$KBCLI_DOCS_DIR" docs/en/preview/cli
rm -rf "$CLONE_DIR"