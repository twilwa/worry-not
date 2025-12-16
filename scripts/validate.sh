#!/usr/bin/env bash
# ABOUTME: Validation script for monorepo setup
# ABOUTME: Runs all quality checks to verify the monorepo is correctly configured

set -e

echo "🔍 Validating End of Line monorepo..."
echo ""

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile
echo "✅ Dependencies installed"
echo ""

echo "🏗️  Building all packages..."
pnpm build
echo "✅ Build successful"
echo ""

echo "🧪 Running tests..."
pnpm test
echo "✅ Tests passed"
echo ""

echo "🎨 Running linter..."
pnpm lint
echo "✅ Linting passed"
echo ""

echo "📝 Type checking..."
pnpm typecheck
echo "✅ Type checking passed"
echo ""

echo "🎉 All validation checks passed!"
echo ""
echo "Monorepo is ready for development:"
echo "  - pnpm dev          # Start all packages"
echo "  - pnpm dev --filter client  # Start only client"
echo "  - pnpm test         # Run tests"
echo "  - pnpm build        # Build all packages"
