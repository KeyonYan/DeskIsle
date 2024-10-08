import { ClimaWidget } from "@/components/widgets/clima";
import { FolderWidget, type FolderWidgetProps } from "@/components/widgets/folder";
import { LinkWidget, type LinkWidgetProps } from "@/components/widgets/link";
import { TimeWidget } from "@/components/widgets/time";
import { type PrimitiveAtom, atom, useAtom } from "jotai";
import { atomWithStorage, splitAtom } from "jotai/utils";
import type React from "react";

import { v4 as uuidv4 } from "uuid";

export type ComponentType = "LinkWidget" | "ClimaWidget" | "FolderWidget" | "TimeWidget";

interface ComponentProps {
	LinkWidget: LinkWidgetProps;
	ClimaWidget: {};
	FolderWidget: FolderWidgetProps;
	TimeWidget: {};
}

export interface BaseComponentMeta<T extends ComponentType = ComponentType> {
	id: string;
	row: number;
	col: number;
	width: number;
	height: number;
	element: T;
	elementProps: ComponentProps[T];
}

type ComponentsRegistry = {
	[key in ComponentType]: {
		name: string;
		Element: React.ComponentType<ComponentProps[key]>;
		defaultProps: {
			width: number;
			height: number;
			elementProps: ComponentProps[key];
		};
		optionalSizes: { w: number; h: number }[];
	};
};

export const componentsRegistry: ComponentsRegistry = {
	LinkWidget: {
		name: "导航组件",
		Element: LinkWidget,
		defaultProps: {
			width: 1,
			height: 1,
			elementProps: {
				link: "",
				icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIwLjgyZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMTMgMTYiPjxjaXJjbGUgY3g9IjIiIGN5PSIxMCIgcj0iMSIgZmlsbD0iY3VycmVudENvbG9yIi8+PGNpcmNsZSBjeD0iMiIgY3k9IjYiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTQuNSAxNGMtLjA2IDAtLjExIDAtLjE3LS4wM2EuNS41IDAgMCAxLS4zLS42NGw0LTExYS41MDEuNTAxIDAgMCAxIC45NC4zNGwtNCAxMWMtLjA3LjItLjI3LjMzLS40Ny4zM20zIDBjLS4wNiAwLS4xMSAwLS4xNy0uMDNhLjUuNSAwIDAgMS0uMy0uNjRsNC0xMWEuNTAxLjUwMSAwIDAgMSAuOTQuMzRsLTQgMTFjLS4wNy4yLS4yNy4zMy0uNDcuMzMiLz48L3N2Zz4=",
				bgColor: "#FFFFFF",
			},
		},
		optionalSizes: [
			{ w: 1, h: 1 },
			{ w: 1, h: 2 },
			{ w: 2, h: 1 },
			{ w: 2, h: 2 },
		],
	},
	ClimaWidget: {
		name: "天气组件",
		Element: ClimaWidget,
		defaultProps: {
			width: 4,
			height: 4,
			elementProps: {},
		},
		optionalSizes: [
			{ w: 4, h: 4 },
			{ w: 5, h: 5 },
		],
	},
	FolderWidget: {
		name: "文件夹组件",
		Element: FolderWidget,
		defaultProps: {
			width: 1,
			height: 1,
			elementProps: {
				title: "文件夹",
				components: [],
			},
		},
		optionalSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 2 },
		],
	},
	TimeWidget: {
		name: "时间组件",
		Element: TimeWidget,
		defaultProps: {
			width: 3,
			height: 1,
			elementProps: {},
		},
		optionalSizes: [{ w: 4, h: 2 }],
	},
};

export const componentsAtoms = atomWithStorage<BaseComponentMeta[]>(
	"components",
	[
		{
			id: uuidv4(),
			row: 0,
			col: 0,
			width: 1,
			height: 1,
			element: "LinkWidget",
			elementProps: {
				link: "https://www.tailwindcss.cn/",
				icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxLjY3ZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjU2IDE1NCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJsb2dvc1RhaWx3aW5kY3NzSWNvbjAiIHgxPSItMi43NzglIiB4Mj0iMTAwJSIgeTE9IjMyJSIgeTI9IjY3LjU1NiUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyMjk4QkQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwRUQ3QjUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSJ1cmwoI2xvZ29zVGFpbHdpbmRjc3NJY29uMCkiIGQ9Ik0xMjggMEM5My44NjcgMCA3Mi41MzMgMTcuMDY3IDY0IDUxLjJDNzYuOCAzNC4xMzMgOTEuNzMzIDI3LjczMyAxMDguOCAzMmM5LjczNyAyLjQzNCAxNi42OTcgOS40OTkgMjQuNDAxIDE3LjMxOEMxNDUuNzUxIDYyLjA1NyAxNjAuMjc1IDc2LjggMTkyIDc2LjhjMzQuMTMzIDAgNTUuNDY3LTE3LjA2NyA2NC01MS4yYy0xMi44IDE3LjA2Ny0yNy43MzMgMjMuNDY3LTQ0LjggMTkuMmMtOS43MzctMi40MzQtMTYuNjk3LTkuNDk5LTI0LjQwMS0xNy4zMThDMTc0LjI0OSAxNC43NDMgMTU5LjcyNSAwIDEyOCAwTTY0IDc2LjhDMjkuODY3IDc2LjggOC41MzMgOTMuODY3IDAgMTI4YzEyLjgtMTcuMDY3IDI3LjczMy0yMy40NjcgNDQuOC0xOS4yYzkuNzM3IDIuNDM0IDE2LjY5NyA5LjQ5OSAyNC40MDEgMTcuMzE4QzgxLjc1MSAxMzguODU3IDk2LjI3NSAxNTMuNiAxMjggMTUzLjZjMzQuMTMzIDAgNTUuNDY3LTE3LjA2NyA2NC01MS4yYy0xMi44IDE3LjA2Ny0yNy43MzMgMjMuNDY3LTQ0LjggMTkuMmMtOS43MzctMi40MzQtMTYuNjk3LTkuNDk5LTI0LjQwMS0xNy4zMThDMTEwLjI0OSA5MS41NDMgOTUuNzI1IDc2LjggNjQgNzYuOCIvPjwvc3ZnPg==",
				bgColor: "#FFFFFF",
			},
		},
		{
			id: uuidv4(),
			row: 0,
			col: 1,
			width: 1,
			height: 1,
			element: "LinkWidget",
			elementProps: {
				link: "https://github.com",
				icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0xMiAyQTEwIDEwIDAgMCAwIDIgMTJjMCA0LjQyIDIuODcgOC4xNyA2Ljg0IDkuNWMuNS4wOC42Ni0uMjMuNjYtLjV2LTEuNjljLTIuNzcuNi0zLjM2LTEuMzQtMy4zNi0xLjM0Yy0uNDYtMS4xNi0xLjExLTEuNDctMS4xMS0xLjQ3Yy0uOTEtLjYyLjA3LS42LjA3LS42YzEgLjA3IDEuNTMgMS4wMyAxLjUzIDEuMDNjLjg3IDEuNTIgMi4zNCAxLjA3IDIuOTEuODNjLjA5LS42NS4zNS0xLjA5LjYzLTEuMzRjLTIuMjItLjI1LTQuNTUtMS4xMS00LjU1LTQuOTJjMC0xLjExLjM4LTIgMS4wMy0yLjcxYy0uMS0uMjUtLjQ1LTEuMjkuMS0yLjY0YzAgMCAuODQtLjI3IDIuNzUgMS4wMmMuNzktLjIyIDEuNjUtLjMzIDIuNS0uMzNzMS43MS4xMSAyLjUuMzNjMS45MS0xLjI5IDIuNzUtMS4wMiAyLjc1LTEuMDJjLjU1IDEuMzUuMiAyLjM5LjEgMi42NGMuNjUuNzEgMS4wMyAxLjYgMS4wMyAyLjcxYzAgMy44Mi0yLjM0IDQuNjYtNC41NyA0LjkxYy4zNi4zMS42OS45Mi42OSAxLjg1VjIxYzAgLjI3LjE2LjU5LjY3LjVDMTkuMTQgMjAuMTYgMjIgMTYuNDIgMjIgMTJBMTAgMTAgMCAwIDAgMTIgMiIvPjwvc3ZnPg==",
				bgColor: "#FFFFFF",
			},
		},
		{
			id: uuidv4(),
			row: 0,
			col: 2,
			width: 1,
			height: 1,
			element: "LinkWidget",
			elementProps: {
				link: "https://notion.so",
				icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIwLjk2ZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjU2IDI2OCI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTE2LjA5MiAxMS41MzhMMTY0LjA5LjYwOGMxOC4xNzktMS41NiAyMi44NS0uNTA4IDM0LjI4IDcuODAxbDQ3LjI0MyAzMy4yODJDMjUzLjQwNiA0Ny40MTQgMjU2IDQ4Ljk3NSAyNTYgNTUuMjA3djE4Mi41MjdjMCAxMS40MzktNC4xNTUgMTguMjA1LTE4LjY5NiAxOS4yNEw2NS40NCAyNjcuMzc4Yy0xMC45MTMuNTE3LTE2LjExLTEuMDQzLTIxLjgyNS04LjMyN0w4LjgyNiAyMTMuODE0QzIuNTg2IDIwNS40ODcgMCAxOTkuMjU0IDAgMTkxLjk3VjI5LjcyNmMwLTkuMzUyIDQuMTU1LTE3LjE1MyAxNi4wOTItMTguMTg4Ii8+PHBhdGggZD0iTTE2NC4wOS42MDhMMTYuMDkyIDExLjUzOEM0LjE1NSAxMi41NzMgMCAyMC4zNzQgMCAyOS43MjZ2MTYyLjI0NWMwIDcuMjg0IDIuNTg1IDEzLjUxNiA4LjgyNiAyMS44NDNsMzQuNzg5IDQ1LjIzN2M1LjcxNSA3LjI4NCAxMC45MTIgOC44NDQgMjEuODI1IDguMzI3bDE3MS44NjQtMTAuNDA0YzE0LjUzMi0xLjAzNSAxOC42OTYtNy44MDEgMTguNjk2LTE5LjI0VjU1LjIwN2MwLTUuOTExLTIuMzM2LTcuNjE0LTkuMjEtMTIuNjZsLTEuMTg1LS44NTZMMTk4LjM3IDguNDA5QzE4Ni45NC4xIDE4Mi4yNy0uOTUyIDE2NC4wOS42MDhNNjkuMzI3IDUyLjIyYy0xNC4wMzMuOTQ1LTE3LjIxNiAxLjE1OS0yNS4xODYtNS4zMjNMMjMuODc2IDMwLjc3OGMtMi4wNi0yLjA4Ni0xLjAyNi00LjY5IDQuMTYzLTUuMjA3bDE0Mi4yNzQtMTAuMzk1YzExLjk0Ny0xLjA0MyAxOC4xNyAzLjEyIDIyLjg0MiA2Ljc1OGwyNC40MDEgMTcuNjhjMS4wNDMuNTI1IDMuNjM4IDMuNjM3LjUxNyAzLjYzN0w3MS4xNDYgNTIuMDk1em0tMTYuMzYgMTgzLjk1NFY4MS4yMjJjMC02Ljc2NyAyLjA3Ny05Ljg4NyA4LjMtMTAuNDEzTDIzMC4wMiA2MC45M2M1LjcyNC0uNTE3IDguMzEgMy4xMiA4LjMxIDkuODc5djE1My45MTdjMCA2Ljc2Ny0xLjA0NCAxMi40OS0xMC4zODcgMTMuMDA4bC0xNjEuNDg3IDkuMzYxYy05LjM0My41MTctMTMuNDg5LTIuNTk0LTEzLjQ4OS0xMC45MjFNMjEyLjM3NyA4OS41M2MxLjAzNCA0LjY4MSAwIDkuMzYyLTQuNjgxIDkuODk3bC03Ljc4MyAxLjU0MnYxMTQuNDA0Yy02Ljc1OCAzLjYzNy0xMi45ODEgNS43MTUtMTguMTggNS43MTVjLTguMzA4IDAtMTAuMzg2LTIuNjA0LTE2LjYwOS0xMC4zOTZsLTUwLjg5OC04MC4wNzl2NzcuNDc2bDE2LjEgMy42NDZzMCA5LjM2Mi0xMi45ODkgOS4zNjJsLTM1LjgxNCAyLjA3N2MtMS4wNDMtMi4wODYgMC03LjI4NCAzLjYzLTguMzE4bDkuMzUxLTIuNTk1VjEwOS44MjNsLTEyLjk4LTEuMDUyYy0xLjA0NC00LjY4IDEuNTUtMTEuNDM5IDguODI2LTExLjk2NWwzOC40MjYtMi41ODVsNTIuOTU4IDgxLjExM3YtNzEuNzZsLTEzLjQ5OC0xLjU1MmMtMS4wNDMtNS43MzMgMy4xMTEtOS44OTYgOC4zLTEwLjQwNHoiLz48L3N2Zz4=",
				bgColor: "#FFFFFF",
			},
		},
		{
			id: uuidv4(),
			row: 0,
			col: 3,
			width: 1,
			height: 1,
			element: "LinkWidget",
			elementProps: {
				link: "https://tsch.js.org/",
				icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHBhdGggZmlsbD0iIzMxNzhDNiIgZD0iTTIwIDBoMjE2YzExLjA0NiAwIDIwIDguOTU0IDIwIDIwdjIxNmMwIDExLjA0Ni04Ljk1NCAyMC0yMCAyMEgyMGMtMTEuMDQ2IDAtMjAtOC45NTQtMjAtMjBWMjBDMCA4Ljk1NCA4Ljk1NCAwIDIwIDAiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTUwLjUxOCAyMDAuNDc1djI3LjYyYzQuNDkyIDIuMzAyIDkuODA1IDQuMDI4IDE1LjkzOCA1LjE3OWM2LjEzMyAxLjE1MSAxMi41OTcgMS43MjYgMTkuMzkzIDEuNzI2YzYuNjIyIDAgMTIuOTE0LS42MzMgMTguODc0LTEuODk5YzUuOTYtMS4yNjYgMTEuMTg3LTMuMzUyIDE1LjY3OC02LjI1N2M0LjQ5Mi0yLjkwNiA4LjA0OC02LjcwNCAxMC42NjktMTEuMzk0YzIuNjItNC42ODkgMy45My0xMC40ODYgMy45My0xNy4zOTFjMC01LjAwNi0uNzQ5LTkuMzk0LTIuMjQ2LTEzLjE2M2EzMC43NDggMzAuNzQ4IDAgMCAwLTYuNDc5LTEwLjA1NWMtMi44MjEtMi45MzUtNi4yMDUtNS41NjctMTAuMTQ5LTcuODk4Yy0zLjk0NS0yLjMzLTguMzk0LTQuNTMxLTEzLjM0Ny02LjYwMmMtMy42MjgtMS40OTctNi44ODEtMi45NDktOS43NjEtNC4zNTljLTIuODc5LTEuNDEtNS4zMjctMi44NDgtNy4zNDItNC4zMTZjLTIuMDE2LTEuNDY3LTMuNTcxLTMuMDIxLTQuNjY1LTQuNjYxYy0xLjA5NC0xLjY0LTEuNjQxLTMuNDk1LTEuNjQxLTUuNTY3YzAtMS44OTkuNDg5LTMuNjEgMS40NjgtNS4xMzVzMi4zNjItMi44MzQgNC4xNDctMy45MjdjMS43ODUtMS4wOTQgMy45NzMtMS45NDIgNi41NjUtMi41NDdjMi41OTEtLjYwNCA1LjQ3MS0uOTA2IDguNjM4LS45MDZjMi4zMDQgMCA0LjczNy4xNzMgNy4yOTkuNTE4YzIuNTYzLjM0NSA1LjE0Ljg3NyA3LjczMiAxLjU5N2E1My42NjkgNTMuNjY5IDAgMCAxIDcuNTU4IDIuNzE5YTQxLjcgNDEuNyAwIDAgMSA2Ljc4MSAzLjc5N3YtMjUuODA3Yy00LjIwNC0xLjYxMS04Ljc5Ny0yLjgwNS0xMy43NzgtMy41ODJjLTQuOTgxLS43NzctMTAuNjk3LTEuMTY1LTE3LjE0Ny0xLjE2NWMtNi41NjUgMC0xMi43ODQuNzA1LTE4LjY1OCAyLjExNWMtNS44NzQgMS40MDktMTEuMDQzIDMuNjEtMTUuNTA2IDYuNjAyYy00LjQ2MyAyLjk5My03Ljk5IDYuODA1LTEwLjU4MiAxMS40MzdjLTIuNTkxIDQuNjMyLTMuODg3IDEwLjE3LTMuODg3IDE2LjYxNWMwIDguMjI4IDIuMzc1IDE1LjI0OCA3LjEyNyAyMS4wNmM0Ljc1MSA1LjgxMSAxMS45NjMgMTAuNzMxIDIxLjYzOCAxNC43NTlhMjkxLjQ1OCAyOTEuNDU4IDAgMCAxIDEwLjYyNSA0LjU3NWMzLjI4MyAxLjQ5NiA2LjExOSAzLjA0OSA4LjUwOSA0LjY2YzIuMzkgMS42MTEgNC4yNzYgMy4zNjYgNS42NTggNS4yNjVjMS4zODIgMS44OTkgMi4wNzMgNC4wNTcgMi4wNzMgNi40NzRhOS45MDEgOS45MDEgMCAwIDEtMS4yOTYgNC45NjNjLS44NjMgMS41MjQtMi4xNzQgMi44NDgtMy45MyAzLjk3Yy0xLjc1NiAxLjEyMi0zLjk0NSAxLjk5OS02LjU2NSAyLjYzMmMtMi42Mi42MzMtNS42ODcuOTUtOS4yLjk1Yy01Ljk4OSAwLTExLjkyLTEuMDUtMTcuNzk0LTMuMTUxYy01Ljg3NS0yLjEtMTEuMzE3LTUuMjUtMTYuMzI3LTkuNDUxbS00Ni4wMzYtNjguNzMzSDE0MFYxMDlINDF2MjIuNzQyaDM1LjM0NVYyMzNoMjguMTM3eiIvPjwvc3ZnPg==",
				bgColor: "#FFFFFF",
			},
		},
		{
			id: uuidv4(),
			row: 0,
			col: 4,
			width: 1,
			height: 1,
			element: "LinkWidget",
			elementProps: {
				link: "https://www.electronjs.org/zh/docs/latest/",
				icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIuMTk3IiBmaWxsPSIjOWZlYWY5Ii8+PHBhdGggZmlsbD0iIzlmZWFmOSIgZD0iTTIxLjYzNDQxIDYuNDM2NzFjLS43MDkwOS0xLjIyNzIzLTIuNDExNTUtMS43MzE0Mi00Ljc5NjI4LTEuNDIzNTRjLS4zMDI1OC4wMzk0Mi0uNjEzNTQuMDkzNzktLjkyOTI3LjE1NzY5QzE1LjAwODU2IDIuNjE5IDEzLjYwNjYgMSAxMiAxQzEwLjM5MDg5IDEgOC45ODcxMyAyLjYyNDQxIDguMDg3IDUuMTgzNGMtMi43Mzg0LS41NDI2OC00LjkwNjU3LS4xNTY2OS01LjcyMTg2IDEuMjUzMzFDMS41NTI1NiA3Ljg0Mzc2IDIuMjk0NyA5LjkwNjI2IDQuMTIxOTMgMTJDMi4yOTQ3IDE0LjA5Mzc0IDEuNTUyNTYgMTYuMTU2MjQgMi4zNjUxIDE3LjU2MzI5Yy41ODE0MyAxLjAwNzMyIDEuODUgMS40OTU0MiAzLjUyNDUzIDEuNDk1NDJhMTEuNDc1MzUgMTEuNDc1MzUgMCAwIDAgMi4xOTctLjI0MzA1QzguOTg2NzMgMjEuMzc1MTggMTAuMzkwNjkgMjMgMTIgMjNjMS42MDY1OCAwIDMuMDA4NTQtMS42MTkgMy45MDg4NC00LjE3MDg2Yy4zMTU3My4wNjM5LjYyNjY5LjExODI3LjkyOTI3LjE1NzY5YTEwLjE4MjM1IDEwLjE4MjM1IDAgMCAwIDEuMjk3LjA4OGMxLjcwNDYxIDAgMi45MjY0Ny0uNTIwMjggMy40OTkzMi0xLjUxMTUxYy44MTI1NC0xLjQwNy4wNzA1My0zLjQ2OTU1LTEuNzU2NDMtNS41NjMyOUMyMS43MDQ5NCA5LjkwNjI2IDIyLjQ0NyA3Ljg0Mzc2IDIxLjYzNDQxIDYuNDM2NzFaTTE2Ljk4NTEgNi4xMzk1NmE5LjA4MDkgOS4wODA5IDAgMCAxIDEuMTU5NjUtLjA4MDQ2YzEuMjYwNDggMCAyLjE0OTc5LjMyODI2IDIuNTA3Ljk0NjE3Yy41MDQyNi44NzMzNS0uMDY2NDUgMi40NDEzOC0xLjU1MTg3IDQuMTY3NzdhMjAuNTA1NTQgMjAuNTA1NTQgMCAwIDAtMi4zMDEzOS0xLjk1MjgxYTE5Ljk3NTIgMTkuOTc1MiAwIDAgMC0uNTQ3MS0yLjkzNjEyQzE2LjQ5NTM5IDYuMjM3NDQgMTYuNzUwMyA2LjE3MDEzIDE2Ljk4NTEgNi4xMzk1NlptLTMuMDcyMzYgOS4xNzQxN2MtLjY0NjQ3LjM3MzMyLTEuMjg0MDguNzAzNDYtMS45MDY5NS45OTM1Yy0uNjM5MzYtLjI5NzU1LTEuMjgxMi0uNjI1MzQtMS45MTktLjk5MzVjLS42NDg4OC0uMzc0NTktMS4yNTUyNS0uNzYzMjYtMS44MTk1OS0xLjE1OTE3Yy0uMDYyMjktLjY4NjEtLjA5Njg4LTEuNDA1LS4wOTY4OC0yLjE1NDU2cy4wMzQ1OS0xLjQ2ODQ2LjA5Njg4LTIuMTU0NTZjLjU2NDM0LS4zOTU5MSAxLjE3MDcxLS43ODQ1OCAxLjgxOTU5LTEuMTU5MTdjLjYzNDg3LS4zNjY0OCAxLjI3MzgzLS42OTMzMyAxLjkxMDI0LS45ODk4MmMuNjI2NjguMjkxMzIgMS4yNjUxMS42MTQwOSAxLjkxNTczLjk4OTgyYy42NDkwOC4zNzQ3MiAxLjI1NTcyLjc2MzQ2IDEuODIwMTkgMS4xNTk1OGMuMDYyMjIuNjg2LjA5NjgyIDEuNDA0NzcuMDk2ODIgMi4xNTQxNXMtLjAzNDYgMS40NjgxMy0uMDk2ODIgMi4xNTQxNUMxNS4xNjg0NiAxNC41NTAyNyAxNC41NjE4MiAxNC45MzkgMTMuOTEyNzQgMTUuMzEzNzNabTEuNjI4LjMzNTFhMTcuODc1NjUgMTcuODc1NjUgMCAwIDEtLjM5MTM2IDEuODI0MDhhMTguNDY0MjQgMTguNDY0MjQgMCAwIDEtMS43NjAxMi0uNTgyNTdjLjM2MjkzLS4xODcxMy43MjcxMy0uMzgzMzcgMS4wOTItLjU5NEMxNC44NDU3IDE2LjA4NiAxNS4xOTc3IDE1Ljg2OTI4IDE1LjU0MDc4IDE1LjY0ODgzWm0tNC45MjQwNyAxLjI0MzcyQTE4LjQxMzI5IDE4LjQxMzI5IDAgMCAxIDguODUxIDE3LjQ3NGExNy44NjAxOCAxNy44NjAxOCAwIDAgMS0uMzkxNzYtMS44MjU0OWMuMzQzMjguMjIwNTguNjk1NDEuNDM3MzQgMS4wNi42NDc4N0M5Ljg4MzU1IDE2LjUwNjc3IDEwLjI0OTg5IDE2LjcwMzQ4IDEwLjYxNjcxIDE2Ljg5MjU1Wk03LjA3NDI4IDEzLjI1MDM2QTE4LjM4NjMgMTguMzg2MyAwIDAgMSA1LjY3NTQ4IDEyYTE4LjM4ODc4IDE4LjM4ODc4IDAgMCAxIDEuMzk4OC0xLjI1MDQzYy0uMDIwMDUuNDEwMzMtLjAzMjUyLjgyNjM2LS4wMzI1MiAxLjI1MDQzUzcuMDU0MjMgMTIuODQwMSA3LjA3NDI4IDEzLjI1MDM2Wm0xLjM4NS00Ljg5ODg2YTE3Ljg2NzI3IDE3Ljg2NzI3IDAgMCAxIC4zOTEtMS44MjIyN2ExOC4yMjIyOCAxOC4yMjIyOCAwIDAgMSAxLjc2OTM3LjU3NjgxYy0uMzY3NzUuMTg5NDctLjczNS4zODY1OS0xLjEwMDMxLjU5NzU5QzkuMTU0NjggNy45MTQxNiA4LjgwMjU1IDguMTMwOTIgOC40NTkyNyA4LjM1MTVabTQuOTMwNTctMS4yNDJhMTguNDg4NDIgMTguNDg4NDIgMCAwIDEgMS43NTk1OC0uNTgyMzdhMTcuODc1NjUgMTcuODc1NjUgMCAwIDEgLjM5MTM2IDEuODI0MDhjLS4zNDMwOC0uMjIwNDUtLjY5NTA4LS40MzcxNS0xLjA1OTQ4LS42NDc1NEMxNC4xMTY2MyA3LjQ5MzEgMTMuNzUyNjMgNy4yOTY1MiAxMy4zODk4NCA3LjEwOTQ2Wk0xNi45MjU3NyAxMC43NUExOC40MDEyNSAxOC40MDEyNSAwIDAgMSAxOC4zMjQgMTJhMTguMzg4MDkgMTguMzg4MDkgMCAwIDEtMS4zOTgyNiAxLjI1Yy4wMi0uNDEwMTMuMDMyNTEtLjgyNi4wMzI1MS0xLjI1UzE2Ljk0NTgxIDExLjE2MDEgMTYuOTI1NzcgMTAuNzVaTTEyIDIuMTI4NTRjLjk5NzczIDAgMi4wNTYxMyAxLjIzNDMzIDIuODA3NDYgMy4zMTA0NGEyMC44MDE1OSAyMC44MDE1OSAwIDAgMC0yLjgwOTQgMS4wMTE0MUEyMC41MTkzNSAyMC41MTkzNSAwIDAgMCA5LjE5MDU1IDUuNDQ0ODFDOS45NDIwOCAzLjM2NTA4IDExLjAwMTYzIDIuMTI4NTQgMTIgMi4xMjg1NFpNMy4zNDc3NCA3LjAwNTI3Yy4zNTEzMy0uNjA4MjUgMS4yNTE5LS45MzQzNyAyLjUyMDQzLS45MzQzN2ExMC4yNjIxMiAxMC4yNjIxMiAwIDAgMSAxLjg4MzYyLjIwMTQ4QTE5Ljk2Nzc4IDE5Ljk2Nzc4IDAgMCAwIDcuMjAxNDcgOS4yMjA1YTIwLjQ4ODc0IDIwLjQ4ODc0IDAgMCAwLTIuMzAxNjYgMS45NTI4OEMzLjQxNDEyIDkuNDQ2OTIgMi44NDM0MSA3Ljg3ODY5IDMuMzQ3NzQgNy4wMDUyN1ptMCA5Ljk4OTQ2Yy0uNTA0MzMtLjg3MzQyLjA2NjM4LTIuNDQxNjUgMS41NTIwNy00LjE2ODExQTIwLjUwMTQ1IDIwLjUwMTQ1IDAgMCAwIDcuMjAxNDcgMTQuNzc5NWExOS45NDQyMiAxOS45NDQyMiAwIDAgMCAuNTUxOCAyLjk1MzU2QzUuNTA1NzggMTguMTYyIDMuODU0NjggMTcuODcyNDUgMy4zNDc3NCAxNi45OTQ3M1pNMTIgMjEuODcxNDZjLS45OTg2NiAwLTIuMDU4NDctMS4yMzcwOC0yLjgxMDA3LTMuMzE3NzVhMjAuNDQ4MjggMjAuNDQ4MjggMCAwIDAgMi44MTE1NS0xLjAwMjU1YTIwLjgwMjA5IDIwLjgwMjA5IDAgMCAwIDIuODA2IDEuMDA5NzlDMTQuMDU2MTUgMjAuNjM3MDYgMTIuOTk3NzUgMjEuODcxNDYgMTIgMjEuODcxNDZabTguNjUxNzUtNC44NzY3M2MtLjQ1OTE0Ljc5Mjc3LTEuNzkyNTcgMS4xMDkyMy0zLjY2NjY3Ljg2NTcxYy0uMjM0OC0uMDMwNTctLjQ4OTcxLS4wOTc4OC0uNzMzNjktLjE0NDU1YTE5Ljk3NjE5IDE5Ljk3NjE5IDAgMCAwIC41NDcxLTIuOTM2MTlBMjAuNTA0MTkgMjAuNTA0MTkgMCAwIDAgMTkuMDk5OSAxMi44MjdDMjAuNTg1MzIgMTQuNTUzMzUgMjEuMTU2IDE2LjEyMTM4IDIwLjY1MTc3IDE2Ljk5NDczWiIvPjxjaXJjbGUgY3g9Ii0uNSIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iIzlmZWFmOSI+PGFuaW1hdGVNb3Rpb24gZHVyPSIycyIgcGF0aD0iTTE0Ljc1IDE0LjE0NzFDMTIuMjI3NyAxNS42MDM0IDkuNjkwMTkgMTYuNDMzMiA3LjY0MDcgMTYuNjE0NUM1LjU0NTk5IDE2Ljc5OTggNC4xNTgzMyAxNi4zMDE4IDMuNjIzMjQgMTUuMzc1QzMuMDg4MTUgMTQuNDQ4MiAzLjM1MDY3IDEyLjk5NzQgNC41NTg1MiAxMS4yNzZDNS43NDAzMSA5LjU5MTc4IDcuNzI3NjggNy44MDkxNSAxMC4yNSA2LjM1Mjg5QzEyLjc3MjMgNC44OTY2MiAxNS4zMDk4IDQuMDY2ODIgMTcuMzU5MyAzLjg4NTQ5QzE5LjQ1NCAzLjcwMDE2IDIwLjg0MTcgNC4xOTgyIDIxLjM3NjggNS4xMjVDMjEuOTExOCA2LjA1MTggMjEuNjQ5MyA3LjUwMjU2IDIwLjQ0MTUgOS4yMjM5N0MxOS4yNTk3IDEwLjkwODIgMTcuMjcyMyAxMi42OTA5IDE0Ljc1IDE0LjE0NzFaIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjwvY2lyY2xlPjwvc3ZnPg==",
				bgColor: "#2B2E3A",
			},
		},
		{
			id: uuidv4(),
			row: 0,
			col: 5,
			width: 2,
			height: 1,
			element: "LinkWidget",
			elementProps: {
				link: "https://open.spotify.com/",
				icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='3.2em' height='1em' viewBox='0 0 512 160'%3E%3Cpath fill='%231ED760' d='M79.655 0C35.664 0 0 35.663 0 79.654c0 43.993 35.664 79.653 79.655 79.653c43.996 0 79.656-35.66 79.656-79.653c0-43.988-35.66-79.65-79.657-79.65zm36.53 114.884a4.963 4.963 0 0 1-6.83 1.646c-18.702-11.424-42.246-14.011-69.973-7.676a4.967 4.967 0 0 1-5.944-3.738a4.96 4.96 0 0 1 3.734-5.945c30.343-6.933 56.37-3.948 77.367 8.884a4.965 4.965 0 0 1 1.645 6.83m9.75-21.689c-1.799 2.922-5.622 3.845-8.543 2.047c-21.41-13.16-54.049-16.972-79.374-9.284a6.22 6.22 0 0 1-7.75-4.138a6.22 6.22 0 0 1 4.141-7.745c28.929-8.778 64.892-4.526 89.48 10.583c2.92 1.798 3.843 5.622 2.045 8.538m.836-22.585C101.1 55.362 58.742 53.96 34.231 61.4c-3.936 1.194-8.098-1.028-9.29-4.964a7.453 7.453 0 0 1 4.965-9.294c28.137-8.542 74.912-6.892 104.469 10.655a7.44 7.44 0 0 1 2.606 10.209c-2.092 3.54-6.677 4.707-10.206 2.605zm89.944 2.922c-13.754-3.28-16.198-5.581-16.198-10.418c0-4.57 4.299-7.645 10.7-7.645c6.202 0 12.347 2.336 18.796 7.143c.19.145.437.203.675.165a.9.9 0 0 0 .6-.367l6.715-9.466a.903.903 0 0 0-.171-1.225c-7.676-6.157-16.313-9.15-26.415-9.15c-14.848 0-25.225 8.911-25.225 21.662c0 13.673 8.95 18.515 24.417 22.252c13.155 3.031 15.38 5.57 15.38 10.11c0 5.032-4.49 8.161-11.718 8.161c-8.028 0-14.582-2.71-21.906-9.046a.93.93 0 0 0-.656-.218a.9.9 0 0 0-.619.313l-7.533 8.96a.906.906 0 0 0 .086 1.256c8.522 7.61 19.004 11.624 30.323 11.624c16 0 26.339-8.742 26.339-22.277c.028-11.421-6.81-17.746-23.561-21.821zm59.792-13.564c-6.934 0-12.622 2.732-17.321 8.33V62c0-.498-.4-.903-.894-.903h-12.318a.9.9 0 0 0-.894.902v70.009c0 .494.4.903.894.903h12.318a.9.9 0 0 0 .894-.903v-22.097c4.699 5.26 10.387 7.838 17.32 7.838c12.89 0 25.94-9.92 25.94-28.886c.019-18.97-13.032-28.894-25.93-28.894zm11.614 28.893c0 9.653-5.945 16.397-14.468 16.397c-8.418 0-14.772-7.048-14.772-16.397c0-9.35 6.354-16.397 14.772-16.397c8.38 0 14.468 6.893 14.468 16.396m47.759-28.893c-16.598 0-29.601 12.78-29.601 29.1c0 16.143 12.917 28.784 29.401 28.784c16.655 0 29.696-12.736 29.696-28.991c0-16.2-12.955-28.89-29.496-28.89zm0 45.385c-8.827 0-15.485-7.096-15.485-16.497c0-9.444 6.43-16.298 15.285-16.298c8.884 0 15.58 7.093 15.58 16.504c0 9.443-6.468 16.291-15.38 16.291m64.937-44.258h-13.554V47.24c0-.497-.4-.902-.894-.902H374.05a.906.906 0 0 0-.904.902v13.855h-5.916a.9.9 0 0 0-.894.902v10.584a.9.9 0 0 0 .894.903h5.916v27.39c0 11.062 5.508 16.674 16.38 16.674c4.413 0 8.075-.914 11.528-2.873a.88.88 0 0 0 .457-.78v-10.083a.9.9 0 0 0-.428-.76a.87.87 0 0 0-.876-.039c-2.368 1.19-4.66 1.741-7.229 1.741c-3.947 0-5.716-1.798-5.716-5.812V73.49h13.554a.9.9 0 0 0 .894-.903V62.003a.873.873 0 0 0-.884-.903zm47.217.054v-1.702c0-5.006 1.921-7.238 6.22-7.238c2.57 0 4.633.51 6.945 1.28a.895.895 0 0 0 1.18-.858l-.001-10.377a.89.89 0 0 0-.637-.865c-2.435-.726-5.555-1.47-10.235-1.47c-11.367 0-17.388 6.405-17.388 18.516v2.606H428.2a.906.906 0 0 0-.904.902v10.638c0 .497.41.903.904.903h5.916v42.237c0 .504.41.904.904.904h12.308c.504 0 .904-.4.904-.904V73.487h11.5l17.616 42.234c-1.998 4.433-3.967 5.317-6.65 5.317c-2.168 0-4.46-.646-6.79-1.93a.98.98 0 0 0-.714-.067a.9.9 0 0 0-.533.485l-4.175 9.16a.9.9 0 0 0 .39 1.17c4.356 2.359 8.284 3.367 13.145 3.367c9.093 0 14.125-4.242 18.548-15.637l21.364-55.204a.88.88 0 0 0-.095-.838a.88.88 0 0 0-.733-.392h-12.822a.9.9 0 0 0-.856.605l-13.136 37.509l-14.382-37.534a.9.9 0 0 0-.837-.58h-21.04zm-27.375-.054h-12.318a.907.907 0 0 0-.903.902v53.724c0 .504.409.904.903.904h12.318c.495 0 .904-.4.904-.904v-53.72a.9.9 0 0 0-.904-.903zm-6.088-24.464c-4.88 0-8.836 3.95-8.836 8.828a8.835 8.835 0 0 0 8.836 8.836c4.88 0 8.827-3.954 8.827-8.836a8.83 8.83 0 0 0-8.827-8.828'/%3E%3C/svg%3E",
				bgColor: "#000000",
			},
		},
		{
			id: uuidv4(),
			row: 1,
			col: 0,
			width: 4,
			height: 4,
			element: "ClimaWidget",
			elementProps: {},
		},
		{
			id: uuidv4(),
			row: 1,
			col: 6,
			width: 1,
			height: 1,
			element: "FolderWidget",
			elementProps: {
				title: "学习",
				components: [
					{
						id: uuidv4(),
						element: "LinkWidget",
						elementProps: {
							link: "https://open.spotify.com/",
							icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='3.2em' height='1em' viewBox='0 0 512 160'%3E%3Cpath fill='%231ED760' d='M79.655 0C35.664 0 0 35.663 0 79.654c0 43.993 35.664 79.653 79.655 79.653c43.996 0 79.656-35.66 79.656-79.653c0-43.988-35.66-79.65-79.657-79.65zm36.53 114.884a4.963 4.963 0 0 1-6.83 1.646c-18.702-11.424-42.246-14.011-69.973-7.676a4.967 4.967 0 0 1-5.944-3.738a4.96 4.96 0 0 1 3.734-5.945c30.343-6.933 56.37-3.948 77.367 8.884a4.965 4.965 0 0 1 1.645 6.83m9.75-21.689c-1.799 2.922-5.622 3.845-8.543 2.047c-21.41-13.16-54.049-16.972-79.374-9.284a6.22 6.22 0 0 1-7.75-4.138a6.22 6.22 0 0 1 4.141-7.745c28.929-8.778 64.892-4.526 89.48 10.583c2.92 1.798 3.843 5.622 2.045 8.538m.836-22.585C101.1 55.362 58.742 53.96 34.231 61.4c-3.936 1.194-8.098-1.028-9.29-4.964a7.453 7.453 0 0 1 4.965-9.294c28.137-8.542 74.912-6.892 104.469 10.655a7.44 7.44 0 0 1 2.606 10.209c-2.092 3.54-6.677 4.707-10.206 2.605zm89.944 2.922c-13.754-3.28-16.198-5.581-16.198-10.418c0-4.57 4.299-7.645 10.7-7.645c6.202 0 12.347 2.336 18.796 7.143c.19.145.437.203.675.165a.9.9 0 0 0 .6-.367l6.715-9.466a.903.903 0 0 0-.171-1.225c-7.676-6.157-16.313-9.15-26.415-9.15c-14.848 0-25.225 8.911-25.225 21.662c0 13.673 8.95 18.515 24.417 22.252c13.155 3.031 15.38 5.57 15.38 10.11c0 5.032-4.49 8.161-11.718 8.161c-8.028 0-14.582-2.71-21.906-9.046a.93.93 0 0 0-.656-.218a.9.9 0 0 0-.619.313l-7.533 8.96a.906.906 0 0 0 .086 1.256c8.522 7.61 19.004 11.624 30.323 11.624c16 0 26.339-8.742 26.339-22.277c.028-11.421-6.81-17.746-23.561-21.821zm59.792-13.564c-6.934 0-12.622 2.732-17.321 8.33V62c0-.498-.4-.903-.894-.903h-12.318a.9.9 0 0 0-.894.902v70.009c0 .494.4.903.894.903h12.318a.9.9 0 0 0 .894-.903v-22.097c4.699 5.26 10.387 7.838 17.32 7.838c12.89 0 25.94-9.92 25.94-28.886c.019-18.97-13.032-28.894-25.93-28.894zm11.614 28.893c0 9.653-5.945 16.397-14.468 16.397c-8.418 0-14.772-7.048-14.772-16.397c0-9.35 6.354-16.397 14.772-16.397c8.38 0 14.468 6.893 14.468 16.396m47.759-28.893c-16.598 0-29.601 12.78-29.601 29.1c0 16.143 12.917 28.784 29.401 28.784c16.655 0 29.696-12.736 29.696-28.991c0-16.2-12.955-28.89-29.496-28.89zm0 45.385c-8.827 0-15.485-7.096-15.485-16.497c0-9.444 6.43-16.298 15.285-16.298c8.884 0 15.58 7.093 15.58 16.504c0 9.443-6.468 16.291-15.38 16.291m64.937-44.258h-13.554V47.24c0-.497-.4-.902-.894-.902H374.05a.906.906 0 0 0-.904.902v13.855h-5.916a.9.9 0 0 0-.894.902v10.584a.9.9 0 0 0 .894.903h5.916v27.39c0 11.062 5.508 16.674 16.38 16.674c4.413 0 8.075-.914 11.528-2.873a.88.88 0 0 0 .457-.78v-10.083a.9.9 0 0 0-.428-.76a.87.87 0 0 0-.876-.039c-2.368 1.19-4.66 1.741-7.229 1.741c-3.947 0-5.716-1.798-5.716-5.812V73.49h13.554a.9.9 0 0 0 .894-.903V62.003a.873.873 0 0 0-.884-.903zm47.217.054v-1.702c0-5.006 1.921-7.238 6.22-7.238c2.57 0 4.633.51 6.945 1.28a.895.895 0 0 0 1.18-.858l-.001-10.377a.89.89 0 0 0-.637-.865c-2.435-.726-5.555-1.47-10.235-1.47c-11.367 0-17.388 6.405-17.388 18.516v2.606H428.2a.906.906 0 0 0-.904.902v10.638c0 .497.41.903.904.903h5.916v42.237c0 .504.41.904.904.904h12.308c.504 0 .904-.4.904-.904V73.487h11.5l17.616 42.234c-1.998 4.433-3.967 5.317-6.65 5.317c-2.168 0-4.46-.646-6.79-1.93a.98.98 0 0 0-.714-.067a.9.9 0 0 0-.533.485l-4.175 9.16a.9.9 0 0 0 .39 1.17c4.356 2.359 8.284 3.367 13.145 3.367c9.093 0 14.125-4.242 18.548-15.637l21.364-55.204a.88.88 0 0 0-.095-.838a.88.88 0 0 0-.733-.392h-12.822a.9.9 0 0 0-.856.605l-13.136 37.509l-14.382-37.534a.9.9 0 0 0-.837-.58h-21.04zm-27.375-.054h-12.318a.907.907 0 0 0-.903.902v53.724c0 .504.409.904.903.904h12.318c.495 0 .904-.4.904-.904v-53.72a.9.9 0 0 0-.904-.903zm-6.088-24.464c-4.88 0-8.836 3.95-8.836 8.828a8.835 8.835 0 0 0 8.836 8.836c4.88 0 8.827-3.954 8.827-8.836a8.83 8.83 0 0 0-8.827-8.828'/%3E%3C/svg%3E",
							bgColor: "#000000",
						},
					},
					{
						id: uuidv4(),
						element: "LinkWidget",
						elementProps: {
							link: "https://www.electronjs.org/zh/docs/latest/",
							icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIuMTk3IiBmaWxsPSIjOWZlYWY5Ii8+PHBhdGggZmlsbD0iIzlmZWFmOSIgZD0iTTIxLjYzNDQxIDYuNDM2NzFjLS43MDkwOS0xLjIyNzIzLTIuNDExNTUtMS43MzE0Mi00Ljc5NjI4LTEuNDIzNTRjLS4zMDI1OC4wMzk0Mi0uNjEzNTQuMDkzNzktLjkyOTI3LjE1NzY5QzE1LjAwODU2IDIuNjE5IDEzLjYwNjYgMSAxMiAxQzEwLjM5MDg5IDEgOC45ODcxMyAyLjYyNDQxIDguMDg3IDUuMTgzNGMtMi43Mzg0LS41NDI2OC00LjkwNjU3LS4xNTY2OS01LjcyMTg2IDEuMjUzMzFDMS41NTI1NiA3Ljg0Mzc2IDIuMjk0NyA5LjkwNjI2IDQuMTIxOTMgMTJDMi4yOTQ3IDE0LjA5Mzc0IDEuNTUyNTYgMTYuMTU2MjQgMi4zNjUxIDE3LjU2MzI5Yy41ODE0MyAxLjAwNzMyIDEuODUgMS40OTU0MiAzLjUyNDUzIDEuNDk1NDJhMTEuNDc1MzUgMTEuNDc1MzUgMCAwIDAgMi4xOTctLjI0MzA1QzguOTg2NzMgMjEuMzc1MTggMTAuMzkwNjkgMjMgMTIgMjNjMS42MDY1OCAwIDMuMDA4NTQtMS42MTkgMy45MDg4NC00LjE3MDg2Yy4zMTU3My4wNjM5LjYyNjY5LjExODI3LjkyOTI3LjE1NzY5YTEwLjE4MjM1IDEwLjE4MjM1IDAgMCAwIDEuMjk3LjA4OGMxLjcwNDYxIDAgMi45MjY0Ny0uNTIwMjggMy40OTkzMi0xLjUxMTUxYy44MTI1NC0xLjQwNy4wNzA1My0zLjQ2OTU1LTEuNzU2NDMtNS41NjMyOUMyMS43MDQ5NCA5LjkwNjI2IDIyLjQ0NyA3Ljg0Mzc2IDIxLjYzNDQxIDYuNDM2NzFaTTE2Ljk4NTEgNi4xMzk1NmE5LjA4MDkgOS4wODA5IDAgMCAxIDEuMTU5NjUtLjA4MDQ2YzEuMjYwNDggMCAyLjE0OTc5LjMyODI2IDIuNTA3Ljk0NjE3Yy41MDQyNi44NzMzNS0uMDY2NDUgMi40NDEzOC0xLjU1MTg3IDQuMTY3NzdhMjAuNTA1NTQgMjAuNTA1NTQgMCAwIDAtMi4zMDEzOS0xLjk1MjgxYTE5Ljk3NTIgMTkuOTc1MiAwIDAgMC0uNTQ3MS0yLjkzNjEyQzE2LjQ5NTM5IDYuMjM3NDQgMTYuNzUwMyA2LjE3MDEzIDE2Ljk4NTEgNi4xMzk1NlptLTMuMDcyMzYgOS4xNzQxN2MtLjY0NjQ3LjM3MzMyLTEuMjg0MDguNzAzNDYtMS45MDY5NS45OTM1Yy0uNjM5MzYtLjI5NzU1LTEuMjgxMi0uNjI1MzQtMS45MTktLjk5MzVjLS42NDg4OC0uMzc0NTktMS4yNTUyNS0uNzYzMjYtMS44MTk1OS0xLjE1OTE3Yy0uMDYyMjktLjY4NjEtLjA5Njg4LTEuNDA1LS4wOTY4OC0yLjE1NDU2cy4wMzQ1OS0xLjQ2ODQ2LjA5Njg4LTIuMTU0NTZjLjU2NDM0LS4zOTU5MSAxLjE3MDcxLS43ODQ1OCAxLjgxOTU5LTEuMTU5MTdjLjYzNDg3LS4zNjY0OCAxLjI3MzgzLS42OTMzMyAxLjkxMDI0LS45ODk4MmMuNjI2NjguMjkxMzIgMS4yNjUxMS42MTQwOSAxLjkxNTczLjk4OTgyYy42NDkwOC4zNzQ3MiAxLjI1NTcyLjc2MzQ2IDEuODIwMTkgMS4xNTk1OGMuMDYyMjIuNjg2LjA5NjgyIDEuNDA0NzcuMDk2ODIgMi4xNTQxNXMtLjAzNDYgMS40NjgxMy0uMDk2ODIgMi4xNTQxNUMxNS4xNjg0NiAxNC41NTAyNyAxNC41NjE4MiAxNC45MzkgMTMuOTEyNzQgMTUuMzEzNzNabTEuNjI4LjMzNTFhMTcuODc1NjUgMTcuODc1NjUgMCAwIDEtLjM5MTM2IDEuODI0MDhhMTguNDY0MjQgMTguNDY0MjQgMCAwIDEtMS43NjAxMi0uNTgyNTdjLjM2MjkzLS4xODcxMy43MjcxMy0uMzgzMzcgMS4wOTItLjU5NEMxNC44NDU3IDE2LjA4NiAxNS4xOTc3IDE1Ljg2OTI4IDE1LjU0MDc4IDE1LjY0ODgzWm0tNC45MjQwNyAxLjI0MzcyQTE4LjQxMzI5IDE4LjQxMzI5IDAgMCAxIDguODUxIDE3LjQ3NGExNy44NjAxOCAxNy44NjAxOCAwIDAgMS0uMzkxNzYtMS44MjU0OWMuMzQzMjguMjIwNTguNjk1NDEuNDM3MzQgMS4wNi42NDc4N0M5Ljg4MzU1IDE2LjUwNjc3IDEwLjI0OTg5IDE2LjcwMzQ4IDEwLjYxNjcxIDE2Ljg5MjU1Wk03LjA3NDI4IDEzLjI1MDM2QTE4LjM4NjMgMTguMzg2MyAwIDAgMSA1LjY3NTQ4IDEyYTE4LjM4ODc4IDE4LjM4ODc4IDAgMCAxIDEuMzk4OC0xLjI1MDQzYy0uMDIwMDUuNDEwMzMtLjAzMjUyLjgyNjM2LS4wMzI1MiAxLjI1MDQzUzcuMDU0MjMgMTIuODQwMSA3LjA3NDI4IDEzLjI1MDM2Wm0xLjM4NS00Ljg5ODg2YTE3Ljg2NzI3IDE3Ljg2NzI3IDAgMCAxIC4zOTEtMS44MjIyN2ExOC4yMjIyOCAxOC4yMjIyOCAwIDAgMSAxLjc2OTM3LjU3NjgxYy0uMzY3NzUuMTg5NDctLjczNS4zODY1OS0xLjEwMDMxLjU5NzU5QzkuMTU0NjggNy45MTQxNiA4LjgwMjU1IDguMTMwOTIgOC40NTkyNyA4LjM1MTVabTQuOTMwNTctMS4yNDJhMTguNDg4NDIgMTguNDg4NDIgMCAwIDEgMS43NTk1OC0uNTgyMzdhMTcuODc1NjUgMTcuODc1NjUgMCAwIDEgLjM5MTM2IDEuODI0MDhjLS4zNDMwOC0uMjIwNDUtLjY5NTA4LS40MzcxNS0xLjA1OTQ4LS42NDc1NEMxNC4xMTY2MyA3LjQ5MzEgMTMuNzUyNjMgNy4yOTY1MiAxMy4zODk4NCA3LjEwOTQ2Wk0xNi45MjU3NyAxMC43NUExOC40MDEyNSAxOC40MDEyNSAwIDAgMSAxOC4zMjQgMTJhMTguMzg4MDkgMTguMzg4MDkgMCAwIDEtMS4zOTgyNiAxLjI1Yy4wMi0uNDEwMTMuMDMyNTEtLjgyNi4wMzI1MS0xLjI1UzE2Ljk0NTgxIDExLjE2MDEgMTYuOTI1NzcgMTAuNzVaTTEyIDIuMTI4NTRjLjk5NzczIDAgMi4wNTYxMyAxLjIzNDMzIDIuODA3NDYgMy4zMTA0NGEyMC44MDE1OSAyMC44MDE1OSAwIDAgMC0yLjgwOTQgMS4wMTE0MUEyMC41MTkzNSAyMC41MTkzNSAwIDAgMCA5LjE5MDU1IDUuNDQ0ODFDOS45NDIwOCAzLjM2NTA4IDExLjAwMTYzIDIuMTI4NTQgMTIgMi4xMjg1NFpNMy4zNDc3NCA3LjAwNTI3Yy4zNTEzMy0uNjA4MjUgMS4yNTE5LS45MzQzNyAyLjUyMDQzLS45MzQzN2ExMC4yNjIxMiAxMC4yNjIxMiAwIDAgMSAxLjg4MzYyLjIwMTQ4QTE5Ljk2Nzc4IDE5Ljk2Nzc4IDAgMCAwIDcuMjAxNDcgOS4yMjA1YTIwLjQ4ODc0IDIwLjQ4ODc0IDAgMCAwLTIuMzAxNjYgMS45NTI4OEMzLjQxNDEyIDkuNDQ2OTIgMi44NDM0MSA3Ljg3ODY5IDMuMzQ3NzQgNy4wMDUyN1ptMCA5Ljk4OTQ2Yy0uNTA0MzMtLjg3MzQyLjA2NjM4LTIuNDQxNjUgMS41NTIwNy00LjE2ODExQTIwLjUwMTQ1IDIwLjUwMTQ1IDAgMCAwIDcuMjAxNDcgMTQuNzc5NWExOS45NDQyMiAxOS45NDQyMiAwIDAgMCAuNTUxOCAyLjk1MzU2QzUuNTA1NzggMTguMTYyIDMuODU0NjggMTcuODcyNDUgMy4zNDc3NCAxNi45OTQ3M1pNMTIgMjEuODcxNDZjLS45OTg2NiAwLTIuMDU4NDctMS4yMzcwOC0yLjgxMDA3LTMuMzE3NzVhMjAuNDQ4MjggMjAuNDQ4MjggMCAwIDAgMi44MTE1NS0xLjAwMjU1YTIwLjgwMjA5IDIwLjgwMjA5IDAgMCAwIDIuODA2IDEuMDA5NzlDMTQuMDU2MTUgMjAuNjM3MDYgMTIuOTk3NzUgMjEuODcxNDYgMTIgMjEuODcxNDZabTguNjUxNzUtNC44NzY3M2MtLjQ1OTE0Ljc5Mjc3LTEuNzkyNTcgMS4xMDkyMy0zLjY2NjY3Ljg2NTcxYy0uMjM0OC0uMDMwNTctLjQ4OTcxLS4wOTc4OC0uNzMzNjktLjE0NDU1YTE5Ljk3NjE5IDE5Ljk3NjE5IDAgMCAwIC41NDcxLTIuOTM2MTlBMjAuNTA0MTkgMjAuNTA0MTkgMCAwIDAgMTkuMDk5OSAxMi44MjdDMjAuNTg1MzIgMTQuNTUzMzUgMjEuMTU2IDE2LjEyMTM4IDIwLjY1MTc3IDE2Ljk5NDczWiIvPjxjaXJjbGUgY3g9Ii0uNSIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iIzlmZWFmOSI+PGFuaW1hdGVNb3Rpb24gZHVyPSIycyIgcGF0aD0iTTE0Ljc1IDE0LjE0NzFDMTIuMjI3NyAxNS42MDM0IDkuNjkwMTkgMTYuNDMzMiA3LjY0MDcgMTYuNjE0NUM1LjU0NTk5IDE2Ljc5OTggNC4xNTgzMyAxNi4zMDE4IDMuNjIzMjQgMTUuMzc1QzMuMDg4MTUgMTQuNDQ4MiAzLjM1MDY3IDEyLjk5NzQgNC41NTg1MiAxMS4yNzZDNS43NDAzMSA5LjU5MTc4IDcuNzI3NjggNy44MDkxNSAxMC4yNSA2LjM1Mjg5QzEyLjc3MjMgNC44OTY2MiAxNS4zMDk4IDQuMDY2ODIgMTcuMzU5MyAzLjg4NTQ5QzE5LjQ1NCAzLjcwMDE2IDIwLjg0MTcgNC4xOTgyIDIxLjM3NjggNS4xMjVDMjEuOTExOCA2LjA1MTggMjEuNjQ5MyA3LjUwMjU2IDIwLjQ0MTUgOS4yMjM5N0MxOS4yNTk3IDEwLjkwODIgMTcuMjcyMyAxMi42OTA5IDE0Ljc1IDE0LjE0NzFaIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjwvY2lyY2xlPjwvc3ZnPg==",
							bgColor: "#2B2E3A",
						},
					},
					{
						id: uuidv4(),
						element: "LinkWidget",
						elementProps: {
							link: "https://www.tailwindcss.cn/",
							icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxLjY3ZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjU2IDE1NCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJsb2dvc1RhaWx3aW5kY3NzSWNvbjAiIHgxPSItMi43NzglIiB4Mj0iMTAwJSIgeTE9IjMyJSIgeTI9IjY3LjU1NiUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyMjk4QkQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwRUQ3QjUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSJ1cmwoI2xvZ29zVGFpbHdpbmRjc3NJY29uMCkiIGQ9Ik0xMjggMEM5My44NjcgMCA3Mi41MzMgMTcuMDY3IDY0IDUxLjJDNzYuOCAzNC4xMzMgOTEuNzMzIDI3LjczMyAxMDguOCAzMmM5LjczNyAyLjQzNCAxNi42OTcgOS40OTkgMjQuNDAxIDE3LjMxOEMxNDUuNzUxIDYyLjA1NyAxNjAuMjc1IDc2LjggMTkyIDc2LjhjMzQuMTMzIDAgNTUuNDY3LTE3LjA2NyA2NC01MS4yYy0xMi44IDE3LjA2Ny0yNy43MzMgMjMuNDY3LTQ0LjggMTkuMmMtOS43MzctMi40MzQtMTYuNjk3LTkuNDk5LTI0LjQwMS0xNy4zMThDMTc0LjI0OSAxNC43NDMgMTU5LjcyNSAwIDEyOCAwTTY0IDc2LjhDMjkuODY3IDc2LjggOC41MzMgOTMuODY3IDAgMTI4YzEyLjgtMTcuMDY3IDI3LjczMy0yMy40NjcgNDQuOC0xOS4yYzkuNzM3IDIuNDM0IDE2LjY5NyA5LjQ5OSAyNC40MDEgMTcuMzE4QzgxLjc1MSAxMzguODU3IDk2LjI3NSAxNTMuNiAxMjggMTUzLjZjMzQuMTMzIDAgNTUuNDY3LTE3LjA2NyA2NC01MS4yYy0xMi44IDE3LjA2Ny0yNy43MzMgMjMuNDY3LTQ0LjggMTkuMmMtOS43MzctMi40MzQtMTYuNjk3LTkuNDk5LTI0LjQwMS0xNy4zMThDMTEwLjI0OSA5MS41NDMgOTUuNzI1IDc2LjggNjQgNzYuOCIvPjwvc3ZnPg==",
							bgColor: "#FFFFFF",
						},
					},
					{
						id: uuidv4(),
						element: "LinkWidget",
						elementProps: {
							link: "https://github.com",
							icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0xMiAyQTEwIDEwIDAgMCAwIDIgMTJjMCA0LjQyIDIuODcgOC4xNyA2Ljg0IDkuNWMuNS4wOC42Ni0uMjMuNjYtLjV2LTEuNjljLTIuNzcuNi0zLjM2LTEuMzQtMy4zNi0xLjM0Yy0uNDYtMS4xNi0xLjExLTEuNDctMS4xMS0xLjQ3Yy0uOTEtLjYyLjA3LS42LjA3LS42YzEgLjA3IDEuNTMgMS4wMyAxLjUzIDEuMDNjLjg3IDEuNTIgMi4zNCAxLjA3IDIuOTEuODNjLjA5LS42NS4zNS0xLjA5LjYzLTEuMzRjLTIuMjItLjI1LTQuNTUtMS4xMS00LjU1LTQuOTJjMC0xLjExLjM4LTIgMS4wMy0yLjcxYy0uMS0uMjUtLjQ1LTEuMjkuMS0yLjY0YzAgMCAuODQtLjI3IDIuNzUgMS4wMmMuNzktLjIyIDEuNjUtLjMzIDIuNS0uMzNzMS43MS4xMSAyLjUuMzNjMS45MS0xLjI5IDIuNzUtMS4wMiAyLjc1LTEuMDJjLjU1IDEuMzUuMiAyLjM5LjEgMi42NGMuNjUuNzEgMS4wMyAxLjYgMS4wMyAyLjcxYzAgMy44Mi0yLjM0IDQuNjYtNC41NyA0LjkxYy4zNi4zMS42OS45Mi42OSAxLjg1VjIxYzAgLjI3LjE2LjU5LjY3LjVDMTkuMTQgMjAuMTYgMjIgMTYuNDIgMjIgMTJBMTAgMTAgMCAwIDAgMTIgMiIvPjwvc3ZnPg==",
							bgColor: "#FFFFFF",
						},
					},
				],
			},
		},
		{
			id: uuidv4(),
			row: 2,
			col: 4,
			width: 4,
			height: 2,
			element: "TimeWidget",
			elementProps: {},
		},
	],
	undefined,
	{ getOnInit: true },
);

export const splitComponentsAtoms = splitAtom(componentsAtoms);

export function useComponentAtom<T extends ComponentType>(componentAtom: PrimitiveAtom<BaseComponentMeta<T>>) {
	const [component, setComponent] = useAtom(componentAtom);
	const [, setComponents] = useAtom(componentsAtoms);
	const deleteComponent = () => {
		setComponents((components) => components.filter((c) => c.id !== component.id));
	};

	const resizeComponent = (width: number, height: number) => {
		setComponent({ ...component, width: width, height: height });
	};

	return {
		component,
		deleteComponent,
		resizeComponent,
		setComponent,
	};
}

export const isDraggingAtom = atom(false);
export const isDeleteModeAtom = atom(false);
