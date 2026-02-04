# Contributing to PDF Splitter Pro

Thank you for your interest in contributing to PDF Splitter Pro! We welcome contributions from the community.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pdf.git
   cd pdf
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

- Feature: `feature/your-feature-name`
- Bug fix: `fix/bug-description`
- Documentation: `docs/what-you-document`

### Commit Messages

We follow conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add dark mode support`

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Run `npm run lint` before committing
- Write meaningful variable and function names
- Add JSDoc comments for public functions

### Testing

- Write tests for new features
- Run tests before submitting: `npm test`
- Ensure all tests pass
- Aim for good test coverage

## Pull Request Process

1. Update your fork with the latest main branch
2. Create a new branch for your feature
3. Make your changes
4. Run tests and linting
5. Commit your changes
6. Push to your fork
7. Open a pull request

### PR Description

Include:
- What the PR does
- Why the change is needed
- Any breaking changes
- Screenshots (if UI changes)
- Related issues

## Project Structure

```
src/
├── components/      # React components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and configuration
├── pages/          # Page components
├── services/       # Business logic services
├── types/          # TypeScript type definitions
└── test/           # Test utilities
```

## Key Technologies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **pdf-lib**: PDF manipulation
- **Vitest**: Testing

## Code Review

All PRs require:
- At least one approval
- All tests passing
- No linting errors
- Updated documentation (if needed)

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about contributing

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions help make PDF Splitter Pro better for everyone!
