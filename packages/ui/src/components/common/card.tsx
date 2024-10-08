import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";

export function DraggableCard({ children, className, onClick }: HTMLAttributes<HTMLDivElement>) {
	return (
		<motion.div
			onClick={onClick}
			drag={true}
			className={cn("rounded-xl border shadow cursor-pointer flex justify-center items-center bg-white", className)}
		>
			{children}
		</motion.div>
	);
}
