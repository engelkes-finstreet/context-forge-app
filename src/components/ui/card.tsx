"use client";

import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

type CardProps = {
  interactive?: boolean;
} & (
  | (React.ComponentProps<"div"> & { interactive?: false | undefined })
  | (Omit<HTMLMotionProps<"div">, "children"> & React.PropsWithChildren & { interactive: true })
)

function Card({
  className,
  interactive = false,
  ...props
}: CardProps) {
  const baseClassName = cn(
    "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 transition-all duration-300 bg-gradient-card shadow-md",
    interactive && "cursor-pointer",
    className
  )

  if (interactive) {
    return (
      <motion.div
        data-slot="card"
        className={baseClassName}
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: "tween", duration: 0.1 }}
        {...(props as HTMLMotionProps<"div">)}
      />
    )
  }

  return (
    <div
      data-slot="card"
      // className={baseClassName}
      className="hover:text-amber-500"
      {...props as React.ComponentProps<"div">}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
