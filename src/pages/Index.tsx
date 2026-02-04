import { ThemeToggle } from '@/components/ThemeToggle';
import { Scissors, Zap, Shield, Brain, Sparkles } from 'lucide-react';
import { memo, lazy, Suspense } from 'react';

const PDFProcessor = lazy(() => import('@/components/PDFProcessor'));

const Index = memo(() => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Premium Header */}
      <div className="relative backdrop-blur-xl bg-background/80 border-b border-primary/20 shadow-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-primary via-primary to-accent p-3 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <Scissors className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-size-200 animate-gradient">
                  PDF Splitter Pro
                </h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary mb-4 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            World-Class PDF Processing
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Split PDFs Like a
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent via-primary to-foreground bg-clip-text text-transparent animate-gradient bg-size-200">
              Professional
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Lightning-fast, secure, and intelligent PDF splitting with advanced batch processing. 
            All processing happens in your browser—no uploads, complete privacy.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/10">
              <div className="text-3xl font-black text-primary">100%</div>
              <div className="text-xs text-muted-foreground">Private</div>
            </div>
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/10">
              <div className="text-3xl font-black text-primary">0s</div>
              <div className="text-xs text-muted-foreground">Upload Time</div>
            </div>
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/10">
              <div className="text-3xl font-black text-primary">∞</div>
              <div className="text-xs text-muted-foreground">File Size</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Suspense
          fallback={(
            <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-sm">
              <div className="space-y-3 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <p className="text-sm text-muted-foreground">Loading PDF tools…</p>
              </div>
            </div>
          )}
        >
          <PDFProcessor />
        </Suspense>
      </div>

      {/* Premium Features Section */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-black mb-4">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Why Choose PDF Splitter Pro?
            </span>
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built with cutting-edge technology for maximum performance and security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Feature 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative p-8 rounded-3xl bg-card/80 backdrop-blur-xl border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3 text-foreground">Lightning Fast</h4>
              <p className="text-muted-foreground leading-relaxed">
                Instant processing with zero latency. Split hundreds of pages in milliseconds using advanced browser APIs.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative p-8 rounded-3xl bg-card/80 backdrop-blur-xl border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3 text-foreground">Smart Processing</h4>
              <p className="text-muted-foreground leading-relaxed">
                Intelligent batch mode, custom naming patterns, and advanced exclusion rules for complex workflows.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative p-8 rounded-3xl bg-card/80 backdrop-blur-xl border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3 text-foreground">100% Secure</h4>
              <p className="text-muted-foreground leading-relaxed">
                Zero server uploads. All processing happens locally in your browser. Your files never leave your device.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative p-8 rounded-3xl bg-card/80 backdrop-blur-xl border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3 text-foreground">Modern UI</h4>
              <p className="text-muted-foreground leading-relaxed">
                Beautiful, responsive design with dark mode support. Built with the latest web technologies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative backdrop-blur-xl bg-background/80 border-t border-primary/20 mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground/60">
              © 2025 PDF Splitter Pro
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
