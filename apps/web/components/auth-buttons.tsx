"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function SignInButton() {
  return (
    <Button variant="ghost" size="sm" asChild>
      <a href="/api/auth/signin">Connexion</a>
    </Button>
  );
}

export function SignOutButton() {
  return (
    <Button variant="ghost" size="sm" asChild>
      <a href="/api/auth/signout">Déconnexion</a>
    </Button>
  );
}
