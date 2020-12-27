import { move_point_event_listener_template } from "stg/entity/ComplexListener";
import { clone } from "stg/entity/Entity";
import { MovePoint, template_config_bullet } from "stg/entity/MovePoint";
import { EntityPool } from "stg/stage/EntityPool";
import { Scheduler } from "stg/stage/Scheuler";
import { StageEntry } from "stg/stage/StageInit";
import * as SRes from "stg/util/shaped_sprites";
import * as Res from "stg/util/sprites";
import { nonblock, repeat } from "../StageBase";

export const test_001: StageEntry = {
    name: "Local Variable Test",
    default_scale: 1,
    init: (time_scale: number) => {
        type BulletStore = { callback: () => void };
        const cf = clone(template_config_bullet);
        cf.listener = move_point_event_listener_template();
        cf.listener.onAttack.push((self) => (<BulletStore>self.custom_fields).callback());
        const ss0 = SRes.getSSCircle(Res.get_small(Res.S_Type.Ball, Res.S_Color.Blue, Res.Sprite_Mode.Overlay), 1);
        const ss1 = SRes.getSSCircle(Res.get_middle(Res.M_Type.Ball, Res.M_Color.Blue, Res.Sprite_Mode.Overlay), 1);
        const ss2 = SRes.getSSCircle(Res.get_small(Res.S_Type.Ball, Res.S_Color.Red, Res.Sprite_Mode.Overlay), 1);
        const ss3 = SRes.getSSCircle(Res.get_middle(Res.M_Type.Ball, Res.M_Color.Red, Res.Sprite_Mode.Overlay), 1);
        const ss4 = SRes.getSSCircle(Res.get_small(Res.S_Type.Ball, Res.S_Color.Cyan, Res.Sprite_Mode.Overlay), 1);
        const ss5 = SRes.getSSCircle(Res.get_middle(Res.M_Type.Ball, Res.M_Color.Cyan, Res.Sprite_Mode.Overlay), 1);
        const ss6 = SRes.getSSCircle(Res.get_small(Res.S_Type.Ball, Res.S_Color.Green, Res.Sprite_Mode.Overlay), 1);
        const ss7 = SRes.getSSCircle(Res.get_middle(Res.M_Type.Ball, Res.M_Color.Green, Res.Sprite_Mode.Overlay), 1);

        const sss = [[ss0, ss1], [ss2, ss3], [ss4, ss5], [ss6, ss7]];

        type TaskStore = { ox: number, oy: number, count: number };
        const r = 50;
        const m = 30;
        const v = 2 / time_scale;
        const adder = (n: number, ind: number) => (scheduler: Scheduler, data: TaskStore = scheduler.custom_fields) => [
            () => {
                const a0 = Math.random() * Math.PI * 2;
                data.ox = r * Math.cos(a0);
                data.oy = 64 + r * Math.sin(a0);
                data.count = 0;
            },
            repeat([
                repeat((i) => [
                    () => EntityPool.INSTANCE.add(new MovePoint(data.count == 0 ? sss[ind][0] : sss[ind][1], cf)
                        .simpleInit(data.ox, data.oy, v, Math.PI * 2 / m * i)
                        .init((bullet, bullet_data: BulletStore = bullet.custom_fields) => {
                            bullet_data.callback = () => data.count++;
                        })),
                ], m),
                () => data.count = 0,
                60 * time_scale
            ], n)
        ];
        return new Scheduler([
            60 * time_scale,
            repeat((i) => [
                nonblock(adder(10, i % 4)),
                165 * time_scale
            ])
        ]);
    }
}