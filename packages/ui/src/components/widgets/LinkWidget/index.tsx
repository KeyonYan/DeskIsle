import type { Comp } from "@/atoms/comps";
import { iconsAtom } from "@/atoms/icons";
import BaseContextMenu from "@/components/common/BaseContextMenu";
import IconShop from "@/components/common/IconShop";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuItem } from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import DataUrlIcon from "@/icons/DataUrlIcon";
import { RadixIconsPencil2 } from "@/icons/RadixIcons";
import { ContextMenuTrigger } from "@radix-ui/react-context-menu";
import {
	DotsHorizontalIcon,
	ExternalLinkIcon,
	StarFilledIcon,
	StarIcon,
} from "@radix-ui/react-icons";
import { type PrimitiveAtom, useAtom } from "jotai";
import { HexAlphaColorPicker } from "react-colorful";
import { useModal } from "react-modal-hook";

export interface LinkWidgetProps {
	compAtom: PrimitiveAtom<Comp>;
}

interface LinkWidgetElementProps {
	link: string;
	icon: string;
	bgColor: string;
}

export default function LinkWidget({ compAtom }: LinkWidgetProps) {
	const [comp] = useAtom(compAtom);
	const { icon, bgColor } = comp.elementProps as LinkWidgetElementProps;
	// const openBrowser: MouseEventHandler = (e) => {
	// 	if (e.button === 0) {
	// 		window.open(link);
	// 	}
	// };
	const [showModal, hideModal] = useModal(() => (
		<Modal showModal={true} hideModal={hideModal}>
			<LinkWidgetEditor compAtom={compAtom} />
		</Modal>
	))
	return (
		<>
			<ContextMenu modal={false}>
				<ContextMenuTrigger className="w-full h-full">
					<div
						// onMouseUp={openBrowser}
						style={{
							backgroundColor: bgColor,
						}}
						className={"w-full h-full rounded-lg text-5xl select-none flex justify-center items-center hover:cursor-pointer"}
					>
						<DataUrlIcon className="w-3/4 h-3/4" src={icon} />
					</div>
				</ContextMenuTrigger>
				<BaseContextMenu compAtom={compAtom}>
					<ContextMenuItem
						onClick={showModal}
						className="flex gap-2"
					>
						<RadixIconsPencil2 />
						<span>编辑</span>
					</ContextMenuItem>
				</BaseContextMenu>
			</ContextMenu>
			{/* <Modal visible={modalVisible} closeModal={() => setModalVisible(false)}>
				<LinkWidgetEditor compAtom={compAtom} />
			</Modal> */}
		</>
	);
}

export interface LinkWidgetEditorProps {
	compAtom: PrimitiveAtom<Comp>;
}

export const LinkWidgetEditor = ({ compAtom }: LinkWidgetEditorProps) => {
	const [comp, setComp] = useAtom(compAtom);
	const [icons, setIcons] = useAtom(iconsAtom);
	const isElectron = window.api !== undefined;
	function updateIcon(icon: string) {
		console.log(icon);
		setComp({ ...comp, elementProps: { ...comp.elementProps as LinkWidgetElementProps, icon } });
	}
	async function openFileDialog() {
		const path = await window.api?.openFile();
		if (path) {
			setComp({ ...comp, elementProps: { ...comp.elementProps as LinkWidgetElementProps, link: path } });
		}
	}
	async function openIconDialog() {
		const path = await window.api?.openFile();
		if (path) {
			updateIcon(path);
		}
	}
	function collectToIconStore() {
		if (!icons.includes((comp.elementProps as LinkWidgetElementProps).icon)) {
			setIcons([...icons, (comp.elementProps as LinkWidgetElementProps).icon]);
		} else {
			setIcons(icons.filter((i) => i !== (comp.elementProps as LinkWidgetElementProps).icon));
		}
	}

	return (
		<div className="grid grid-cols-5 items-center gap-2">
			<Label className="col-span-1" htmlFor="link">
				路径
			</Label>
			<div className="col-span-4 grid grid-cols-4 gap-2">
				<Input
					className="col-span-3"
					id="link"
					value={(comp.elementProps as LinkWidgetElementProps).link}
					onChange={(v) =>
						setComp({
							...comp,
							elementProps: { ...comp.elementProps as LinkWidgetElementProps, link: v.target.value },
						})}
				/>
				{isElectron &&
					<Button onClick={openFileDialog} variant="outline" size="icon">
						<DotsHorizontalIcon />
					</Button>
				}
			</div>
			<Label className="col-span-1" htmlFor="icon">
				图标
			</Label>
			<Tabs className="col-span-4" defaultValue="icon-shop">
				<TabsList>
					<TabsTrigger value="icon-shop">图标商店</TabsTrigger>
					<TabsTrigger className="flex gap-1" value="icon-url">
						<span>图标URL</span>
						<ExternalLinkIcon
							onClick={() => window.open("https://icones.js.org/")}
						/>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="icon-shop">
					<IconShop onSelect={(icon: string) => updateIcon(icon)} />
				</TabsContent>
				<TabsContent value="icon-url">
					<div className="grid grid-cols-4 gap-2">
						<Input
							className="col-span-3"
							id="icon"
							value={(comp.elementProps as LinkWidgetElementProps).icon}
							onChange={(v) => updateIcon(v.target.value)}
						/>
						<div className="flex flex-row gap-1">
							{isElectron &&
								<Button onClick={openIconDialog} variant="outline" size="icon">
									<DotsHorizontalIcon />
								</Button>
							}
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Button
											onClick={collectToIconStore}
											variant="outline"
											size="icon"
										>
											{icons.includes((comp.elementProps as LinkWidgetElementProps).icon)
												? <StarFilledIcon />
												: <StarIcon />}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										{icons.includes((comp.elementProps as LinkWidgetElementProps).icon)
											? <p>取消收藏</p>
											: <p>收藏到图标商店</p>}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
				</TabsContent>
			</Tabs>

			<Label className="row-span-2" htmlFor="bgColor">
				背景色
			</Label>
			<HexAlphaColorPicker
				className="col-span-4 mt-4"
				id="bgColor"
				color={(comp.elementProps as LinkWidgetElementProps).bgColor}
				onChange={(c) =>
					setComp({
						...comp,
						elementProps: { ...comp.elementProps as LinkWidgetElementProps, bgColor: c },
					})}
			/>
			<Input
				className="col-span-2"
				value={(comp.elementProps as LinkWidgetElementProps).bgColor}
				onChange={(c) =>
					setComp({
						...comp,
						elementProps: { ...comp.elementProps as LinkWidgetElementProps, bgColor: c.target.value },
					})}
			/>
		</div>
	);
};
