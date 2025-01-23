import { SiGithub } from "@icons-pack/react-simple-icons";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-6 py-4 h-16 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Seven</p>
        <a href="https://github.com/SevenTeamTwo">
          <SiGithub className="h-6 w-6 text-foreground" />
        </a>
      </div>
    </footer>
  );
}
