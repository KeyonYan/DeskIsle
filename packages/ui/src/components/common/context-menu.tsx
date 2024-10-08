import { useLayoutConfig } from "@/atoms/layout";
import type React from "react";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "../ui/context-menu";
import { DeleteMenuItem, LinkWidgetMenuItem, ResizeMenuItem } from "./menu-item";

interface BaseContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function BaseContextMenu({ children }: BaseContextMenuProps) {
	const { setIsDraggable } = useLayoutConfig();

	const handleOpenChange = (open: boolean) => {
		setIsDraggable(!open);
	};

	return (
		<ContextMenu modal={false} onOpenChange={handleOpenChange}>
			<ContextMenuTrigger>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<ResizeMenuItem />
				<LinkWidgetMenuItem />
				<DeleteMenuItem />
			</ContextMenuContent>
		</ContextMenu>
	);
}
