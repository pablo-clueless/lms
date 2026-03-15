import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-6 sm:py-12">
      <div className="container mx-auto space-y-6">
        <Link className="w-fit" href="/">
          <h1 className="w-fit text-9xl">ArcLMS</h1>
        </Link>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4"></div>
        <div className="flex items-center justify-between text-sm text-neutral-400">
          <p className="">&copy; {new Date().getFullYear()} ArcLMS. All rights reserved.</p>
          <div className="flex items-center gap-x-4">
            <Link className="link dark" href="/terms-of-service">
              Terms of Service
            </Link>
            <Link className="link dark" href="/privacy-policy">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
