import * as gl from "./gl"
import { scrCoord_to_GLCoord_x, scrCoord_to_GLCoord_y } from "./Screen";

export class GLHelper {

    private ver: number[] = [];
    private tex: number[] = [];
    private alp: number[] = [];
    private img: any;
    private n: number = 0;

    public bind(texture: any) {
        this.img = texture;
    }

    public rect([px, py, pw, ph]: number[], magn: number) {
        const data = [px, py, px, py + ph, px + pw, py, px, py + ph, px + pw, py, px + pw, py + ph];
        this.ver.push(...data);
        this.tex.push(...data.map(e => e * magn));
        this.alp.push(1, 1, 1, 1, 1, 1);
        this.n += 6;
    }

    public fan([da, oa, ox, oy, or, ta, tx, ty, trw, trh, alpha]: number[], n: number) {
        const num = Math.ceil(Math.abs(da) / (Math.PI * 2) * n);
        const f1 = (list: number[], x: number, y: number, rw: number, rh: number, a: number, b: number) => list.push(
            x, y, x + rw * Math.cos(a), y + rh * Math.sin(a), x + rw * Math.cos(b), y + rh * Math.sin(b));
        for (let i = 0; i < num; i++) {
            f1(this.ver, ox, oy, or, or, oa + da / num * i, oa + da / num * (i + 1));
            f1(this.tex, tx, ty, trw, trh, ta + da / num * i, ta + da / num * (i + 1));
            this.alp.push(alpha, alpha, alpha);
        }
        this.n += num * 3;
    }

    public flush() {
        const fver = new Float32Array(this.ver);
        for (let i = 0; i < fver.length; i += 2) {
            fver[i] = scrCoord_to_GLCoord_x(fver[i]);
            fver[i + 1] = scrCoord_to_GLCoord_y(fver[i + 1]);
        }
        gl.draw(fver, new Float32Array(this.tex), new Float32Array(this.alp), this.img, this.n);
        this.ver = [];
        this.tex = [];
        this.alp = [];
        this.n = 0;
    }


}