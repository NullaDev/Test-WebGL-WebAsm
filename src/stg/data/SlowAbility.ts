
import { EntityPool } from "../stage/EntityPool";
import { AbstractAbility } from "./AbstractAbility";

export class SlowAbility extends AbstractAbility {

    constructor() {
        super(120);
    }

    public update(): void {
        EntityPool.INSTANCE.special_effects.time_slowdown(0.5);
        this.special_remain -= EntityPool.INSTANCE.special_effects.time_rate;
    }
    public onActivate(): void {
    }

};