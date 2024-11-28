"use client";
import { H1 } from "@/components/design-system/headings";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ErrorPage() {
  const [open, setOpen] = useState(false);

  // get query params next app router
  const errorMessage = useSearchParams().get("error");
  return (
    <div>
      <H1>Something went wrong!</H1>
      <p className="my-3">{errorMessage}</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        <Dialog open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
          <DialogTrigger asChild>
            <AnimatedButton type="button" variant={"outline"}>
              Reset Password
            </AnimatedButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Enter your email below to receive a reset password link!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <AnimatedButton type="button" variant={"outline"}>
                Reset Password
              </AnimatedButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
