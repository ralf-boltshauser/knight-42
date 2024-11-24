"use client";

import { motion } from "framer-motion";
import React from "react";
import { Button, ButtonProps } from "./button";

const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { layoutId?: string }
>(({ layoutId, ...props }, ref) => {
  return (
    <Button asChild {...props} ref={ref}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        layoutId={layoutId}
      >
        {props.children}
      </motion.button>
    </Button>
  );
});
AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
