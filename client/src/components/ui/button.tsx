import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Material Design 3 inspired button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        // Material Design 3 Filled button (high emphasis)
        default: "bg-primary-blue text-white hover:bg-primary-blue-400 shadow-sm hover:shadow-md rounded-full",
        
        // Material Design 3 Error button
        destructive: "bg-[#F44336] text-white hover:bg-[#E53935] shadow-sm hover:shadow-md rounded-full",
        
        // Material Design 3 Outlined button
        outline: "border-2 border-primary-blue text-primary-blue bg-transparent hover:bg-primary-blue/5 hover:shadow-sm active:bg-primary-blue/10 rounded-full",
        
        // Secondary color variant (using primary-red)
        secondary: "bg-primary-red text-white hover:bg-[#ef5350] shadow-sm hover:shadow-md rounded-full",
        
        // Material Design 3 Text button (low emphasis)
        ghost: "text-primary-blue hover:bg-primary-blue/10 active:bg-primary-blue/20 hover:text-primary-blue rounded-full",
        
        // Link button
        link: "text-primary-blue underline-offset-4 hover:underline p-0 h-auto hover:translate-y-0",
        
        // Material Design 3 Tonal button (medium emphasis)
        tonal: "bg-primary-blue/10 text-primary-blue hover:bg-primary-blue/20 active:bg-primary-blue/30 rounded-full",
        
        // Material Design 3 Elevated button
        elevated: "bg-white text-neutral-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-neutral-100 rounded-xl",
        
        // Material Design 3 inspired gradient button
        gradient: "text-white shadow-md hover:shadow-lg bg-gradient-to-r from-primary-blue via-primary-blue-400 to-primary-blue rounded-full hover:-translate-y-0.5",
        
        // Alternate gradient
        gradientRed: "text-white shadow-md hover:shadow-lg bg-gradient-to-r from-primary-red via-primary-red-400 to-primary-red rounded-full hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 py-1.5 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        xl: "h-14 px-10 py-4 text-lg",
        icon: "h-10 w-10 p-2 rounded-full",
      },
      // New property for full width buttons
      fullWidth: {
        true: "w-full",
        false: ""
      },
      // New property for flat vs elevated states
      elevation: {
        flat: "",
        low: "shadow-sm hover:shadow-md",
        medium: "shadow-md hover:shadow-lg",
        high: "shadow-lg hover:shadow-xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
      elevation: "low"
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, elevation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Handle ripple effect for buttons - only for actual button elements, not for Slot
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (asChild) {
        // If using Slot, just call the original onClick
        if (props.onClick) {
          props.onClick(event);
        }
        return;
      }
      
      try {
        const button = event.currentTarget;
        
        // Create ripple element
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        // Get position relative to the button
        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");
        
        // Remove existing ripples
        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) {
          ripple.remove();
        }
        
        button.appendChild(circle);
      } catch (error) {
        console.log("Ripple effect error:", error);
      }
      
      // Call the original onClick handler if provided
      if (props.onClick) {
        props.onClick(event);
      }
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, elevation, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants }
