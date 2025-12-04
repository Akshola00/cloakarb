export function Footer() {
  return (
    <footer className="flex h-10 items-center justify-between border-t border-border bg-background px-4 lg:px-6">
      <p className="text-xs text-muted-foreground">Built for Zypherpunk Hackathon © 2025</p>
      <div className="flex gap-4">
        <a
          href="https://docs.near.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-foreground hover:text-primary"
        >
          Docs
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-foreground hover:text-primary"
        >
          Source
        </a>
        <a href="#" className="text-xs text-foreground hover:text-primary">
          Privacy Policy
        </a>
      </div>
    </footer>
  )
}
