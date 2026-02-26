import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Item Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The menu item you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/menu">Back to Menu</Link>
        </Button>
      </div>
    </div>
  );
}
