#!/bin/bash
#
# pr-task.sh - Create isolated worktree for PR-based development
#
# Usage: ./scripts/pr-task.sh "feat: add billing table"
#
# This script creates a git worktree for isolated feature development.
# Each worktree = 1 branch = 1 PR

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if title is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: PR title is required${NC}"
    echo ""
    echo "Usage: ./scripts/pr-task.sh \"feat: add billing table\""
    exit 1
fi

PR_TITLE="$1"

# Convert title to slug
# - lowercase
# - replace spaces with hyphens
# - remove special characters except hyphens
# - trim leading/trailing hyphens
SLUG=$(echo "$PR_TITLE" | \
    tr '[:upper:]' '[:lower:]' | \
    sed 's/[^a-z0-9 -]//g' | \
    sed 's/ /-/g' | \
    sed 's/--*/-/g' | \
    sed 's/^-//' | \
    sed 's/-$//')

# Generate branch name
BRANCH_NAME="chore/${SLUG}"

# Worktree directory
WORKTREE_DIR=".worktrees/${SLUG}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  PR Worktree Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}PR Title:${NC} $PR_TITLE"
echo -e "${YELLOW}Slug:${NC} $SLUG"
echo -e "${YELLOW}Branch:${NC} $BRANCH_NAME"
echo -e "${YELLOW}Worktree:${NC} $WORKTREE_DIR"
echo ""

# Check if worktree already exists
if [ -d "$WORKTREE_DIR" ]; then
    echo -e "${RED}Error: Worktree already exists at $WORKTREE_DIR${NC}"
    echo ""
    echo "To remove existing worktree:"
    echo "  git worktree remove $WORKTREE_DIR"
    exit 1
fi

# Check if branch already exists
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    echo -e "${RED}Error: Branch '$BRANCH_NAME' already exists${NC}"
    echo ""
    echo "To delete the branch:"
    echo "  git branch -D $BRANCH_NAME"
    exit 1
fi

# Fetch latest from origin
echo -e "${GREEN}Fetching latest from origin...${NC}"
git fetch origin

# Get default branch (main or master)
DEFAULT_BRANCH=$(git remote show origin | grep 'HEAD branch' | cut -d' ' -f5)
if [ -z "$DEFAULT_BRANCH" ]; then
    DEFAULT_BRANCH="main"
fi
echo -e "${YELLOW}Default branch:${NC} $DEFAULT_BRANCH"

# Create worktrees directory if it doesn't exist
mkdir -p .worktrees

# Create worktree with new branch based on origin/default
echo -e "${GREEN}Creating worktree...${NC}"
git worktree add -b "$BRANCH_NAME" "$WORKTREE_DIR" "origin/$DEFAULT_BRANCH"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Worktree Created Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Worktree path:${NC}"
echo "  $WORKTREE_DIR"
echo ""
echo -e "${YELLOW}To start working:${NC}"
echo "  cd $WORKTREE_DIR"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. cd $WORKTREE_DIR"
echo "  2. pnpm install (if needed)"
echo "  3. Make your changes"
echo "  4. git add . && git commit -m \"$PR_TITLE\""
echo "  5. git push -u origin $BRANCH_NAME"
echo "  6. gh pr create --title \"$PR_TITLE\""
echo ""
echo -e "${YELLOW}When done:${NC}"
echo "  cd $(pwd)"
echo "  git worktree remove $WORKTREE_DIR"
echo ""
