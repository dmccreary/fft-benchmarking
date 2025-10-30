# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an educational website about benchmarking FFT (Fast Fourier Transform) algorithms, built with MkDocs and the Material theme. The site is designed for a 10-week college course teaching students how to objectively benchmark FFT implementations on microcontrollers and CPUs, with a focus on ARM Cortex-M processors (M33, M4) like those in the Raspberry Pi Pico 2.

## Site Architecture

**Static Site Generator:** MkDocs with Material theme
- All content is written in Markdown and stored in `/docs/`
- Site configuration is in `mkdocs.yml` at the root
- Generated static site is built to `/site/` directory
- Deployed to GitHub Pages at: https://dmccreary.github.io/fft-benchmarking/

**Content Structure:**
- Course materials focus on FFT fundamentals, DSP hardware acceleration, benchmarking methodologies, and performance analysis
- Main topics include: FFT algorithms, ARM DSP instructions, FFT libraries, integer vs floating point tradeoffs, and result visualization
- Cornell Labs reference material (`docs/cornell-labs/pico-example.md`) demonstrates real-time FFT/iFFT on Raspberry Pi Pico RP2350

## Common Commands

### Building and Testing
```sh
# Build the site (outputs to ./site/)
mkdocs build

# Run local development server at http://localhost:8000
mkdocs serve

# Deploy to GitHub Pages
mkdocs gh-deploy
```

Note: `mkdocs gh-deploy` only deploys to GitHub Pages - it does NOT commit source changes to the repository.

### Git Workflow
```sh
# After making changes to docs/ or mkdocs.yml
git add [FILES]
git commit -m "description of changes"
git push
```

## Development Environment

**Python Environment:** Can use either conda or venv
- Conda approach (recommended for this project):
  ```sh
  conda create -n mkdocs python=3
  conda activate mkdocs
  pip install mkdocs "mkdocs-material[imaging]"
  ```

**Social Card Images:** Material theme social cards require additional system libraries on macOS:
```sh
brew install cairo freetype libffi libjpeg libpng zlib
export DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib  # Add to ~/.zshrc
```

## MkDocs Configuration Details

The `mkdocs.yml` file controls:
- Site metadata (name, description, author, URLs)
- Navigation structure in the `nav:` section
- Material theme settings (colors: blue primary, orange accent)
- Features enabled: code copy, navigation expansion, search, edit buttons
- Markdown extensions for admonitions, code highlighting, details/superfences

**Edit Icon:** The edit icon on each page is enabled via:
- `edit_uri: 'blob/master/docs'` in config
- `content.action.edit` in theme features

## Content Guidelines

When adding or modifying documentation:
- Write all content in Markdown format in the `/docs/` directory
- Follow the course structure focusing on FFT performance, DSP hardware, and benchmarking
- Reference the Cornell Labs example for practical real-time FFT implementation details
- Update the `nav:` section in `mkdocs.yml` when adding new pages
- Test locally with `mkdocs serve` before deploying

## Repository Context

- Main branch: `main`
- License: Creative Commons ShareAlike Attribution Noncommercial (see license.md)
- Related repositories referenced: GitHub FFT libraries and Cornell ECE4760 course materials
- Target audience: College juniors/seniors with signal processing interest
