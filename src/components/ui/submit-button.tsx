"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useFormStatus } from "react-dom";
import { AnimatedButton } from "./animated-button";
import { ButtonProps } from "./button";

export interface SubmitButtonProps extends ButtonProps {
  isPending?: boolean;
  spinner?: boolean;
}

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ isPending = false, spinner = true, ...props }, ref) => {
    const { pending } = useFormStatus();

    const buttonPending = pending || isPending;

    return (
      <AnimatedButton
        ref={ref}
        type="submit"
        aria-disabled={buttonPending}
        disabled={buttonPending}
        {...props}
        className={`inline-flex items-center gap-2 ${props.className}`}
      >
        <AnimatePresence mode="popLayout">
          {buttonPending && spinner ? (
            <motion.div
              key={"spinner"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.2, ease: "easeInOut", delay: 0.1 }}
              className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
            />
          ) : null}
        </AnimatePresence>
        <motion.span transition={{ duration: 0.2, ease: "easeInOut" }} layout>
          {props.children}
        </motion.span>
      </AnimatedButton>
    );
  }
);
SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
