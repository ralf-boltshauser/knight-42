import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex items-center justify-between">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        variant={"outline"}
        className="ml-3"
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
});
PasswordInput.displayName = "Input";

export { PasswordInput };
