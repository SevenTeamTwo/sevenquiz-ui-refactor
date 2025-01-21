export function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto px-6 py-4 h-16 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} SevenQuiz</p>
        <p className="text-muted-foreground text-sm">Fait par Adam et Maxence Brutsaert</p>
      </div>
    </footer>
  );
}
