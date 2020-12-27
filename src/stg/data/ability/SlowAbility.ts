
import { EntityPool } from "stg/stage/EntityPool";
import { AbilityEntry, AbstractAbility } from "./AbstractAbility";

class SlowAbility extends AbstractAbility {

    constructor() {
        super(240);
    }

    public update(): void {
        this.special_remain--;
    }
    public onActivate(): boolean {
        if (EntityPool.INSTANCE.special_effects.list.length > 0)
            return false;
        EntityPool.INSTANCE.special_effects.time_slowdown(0.5, 240);
        return true;
    }

};

export const ability_slow: AbilityEntry = {
    name: "slow",
    init: () => new SlowAbility()
}