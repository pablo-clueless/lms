import Link from "next/link";

import { Button } from "../ui/button";

export const Navbar = () => {
  return (
    <nav className="py-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <h3 className="text-2xl font-bold">ArcLMS</h3>
        </Link>
        <div className="flex items-center gap-x-4">
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button variant="outline">Contact Support</Button>
        </div>
      </div>
    </nav>
  );
};
