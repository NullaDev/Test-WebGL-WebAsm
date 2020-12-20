export var devicePixelRatio: number;
export var last_update_rate: number;
export var canvas_width: number;
export var canvas_height: number;
export function test_fps(): Promise<number>;
export function setup_canvas(): void;
export function mainloop_start(): void;
export function mainloop_terminate(): void;
export var mouse: { x: number, y: number };
export var keys: { [key: string]: number };
export const KEY_PRESS: number;
export const KEY_CLICK: number;