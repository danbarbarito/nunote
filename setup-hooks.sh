#!/bin/bash

# Create symlink from .git/hooks/pre-commit to .hooks/pre-commit
ln -sf "../../.hooks/pre-commit" ".git/hooks/pre-commit"
chmod +x .hooks/pre-commit