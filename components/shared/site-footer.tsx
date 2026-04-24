import { Code2, Mail, MessageCircle } from 'lucide-react';

const LINKEDIN_URL =
  'https://www.linkedin.com/in/c%C3%A9sar-mateo-cort%C3%A9s-le%C3%B3n-b823a2206/';
const EMAIL = 'cesarcortes4@outlook.com';
const GITHUB_URL = 'https://github.com/cesarcortes-dep/MetaCheck';

interface FooterLinkProps {
  href: string;
  external?: boolean;
  icon: typeof MessageCircle;
  label: string;
}

function FooterLink({ href, external, icon: Icon, label }: FooterLinkProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a
      href={href}
      {...externalProps}
      className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </a>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t pt-6 pb-8 text-sm text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          © {year} Cesar Cortes · Built as part of{' '}
          <span className="font-medium text-foreground">Growing Lab</span>
        </div>
        <div className="flex flex-wrap gap-5">
          <FooterLink href={LINKEDIN_URL} external icon={MessageCircle} label="LinkedIn" />
          <FooterLink href={`mailto:${EMAIL}`} icon={Mail} label="Email" />
          <FooterLink href={GITHUB_URL} external icon={Code2} label="GitHub" />
        </div>
      </div>
    </footer>
  );
}
