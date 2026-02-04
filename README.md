# PDF Splitter Pro

A modern, high-performance PDF splitting application built with React, TypeScript, and Vite. Split PDFs with intelligent batch processing, custom naming patterns, and complete privacy—all processing happens locally in your browser.

## ✨ Features

- **Lightning Fast**: Process hundreds of pages in milliseconds
- **100% Private**: All processing happens locally—no server uploads
- **Smart Processing**: Custom ranges, exclusions, and naming patterns
- **Modern UI**: Beautiful, responsive design with dark mode support
- **Zero Setup**: No installation required, works directly in your browser

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 📖 Usage

1. **Upload PDF**: Drag and drop or click to select a PDF file (max 500MB)
2. **Configure**: Set prefix, suffix, and page ranges
3. **Process**: Click "Split PDF" to process your file
4. **Download**: Get your split PDFs in a convenient ZIP file

### Page Ranges

Specify pages to extract using comma-separated ranges:
- `1-5`: Pages 1 through 5
- `1-5,10-15`: Pages 1-5 and 10-15
- `1,3,5`: Individual pages 1, 3, and 5

### Skip Numbers (Optional)

Skip specific numbers in filenames while still extracting all pages:
- Input: `3,6` with 5 pages
- Output: Files named `001.pdf`, `002.pdf`, `004.pdf`, `005.pdf`, `007.pdf`

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Full type safety
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first styling
- **pdf-lib**: PDF manipulation
- **JSZip**: Archive creation
- **Vitest**: Unit testing
- **React Testing Library**: Component testing

## 📁 Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── ConfigurationForm.tsx
│   ├── ErrorBoundary.tsx
│   ├── FileUpload.tsx
│   ├── PDFProcessor.tsx
│   ├── ProgressDisplay.tsx
│   ├── ResultsList.tsx
│   └── ThemeToggle.tsx
├── hooks/             # Custom React hooks
│   ├── use-toast.ts
│   └── usePDFProcessor.ts
├── lib/               # Utility functions
│   ├── constants.ts
│   ├── pdf-utils.ts
│   └── utils.ts
├── pages/             # Page components
│   ├── Index.tsx
│   └── NotFound.tsx
└── test/              # Test configuration
    └── setup.ts
```

## 🧪 Testing

The project includes comprehensive unit tests for:
- PDF utilities (range parsing, filename generation)
- React hooks (state management)
- Components (user interactions, error handling)

Run tests with:
```bash
npm test                # Run all tests
npm run test:ui         # Open Vitest UI
npm run test:coverage   # Generate coverage report
```

## 🎨 Customization

### Theme

The application supports both light and dark modes. Toggle using the theme button in the header.

### Configuration

- **Max File Size**: Configured in `src/lib/constants.ts` (default: 500MB)
- **Styling**: Customize colors and styling in `tailwind.config.ts`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [pdf-lib](https://pdf-lib.js.org/) - PDF manipulation
- [JSZip](https://stuk.github.io/jszip/) - ZIP file creation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI primitives

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using React and TypeScript
