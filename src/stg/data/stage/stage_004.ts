import { MovePoint, template_config_bullet, MovePointConfig, Motion } from "../../entity/MovePoint";
import { Mover, MoverConfig, Repeat, RepeatSupplier, Scheduler, SchedulerParam } from "../../stage/Scheuler";
import { SpriteManager } from "../../util/SpriteManager";
import * as Res from "../../util/sprites";
import * as SRes from "../../util/shaped_sprites";
import { EntityPool } from "../../stage/EntityPool";
import { StageEntry, StageInit } from "../../stage/StageInit";
import { ShapeCircle, ShapeDualArc, ShapePoint, SIPoint, SSPoint } from "../../util/Shape";
import { clone } from "../../entity/Entity";
import { RayLaser, RayLaserConfig, RayLaserMotion, SSRay } from "../../entity/RayLaser";
import { move_point_event_listener_template, ray_laser_event_listener_template, reflect_config_default, reflect_disable, reflect_linear, reflect_rl, RLReflectConfig, rl_reflect_config_default } from "../../entity/ComplexListener";
import { nonblock, repeat } from "./StageBase";

export const stage_004: StageEntry = {
    name: "finite reflect",
    default_scale: 3,
    init: (time_scale: number) => {
        const ss0 = SRes.getSSCircle(Res.get_small(Res.S_Type.Grain, Res.S_Color.Red, Res.Sprite_Mode.Overlay), 1);
        const ss1 = SRes.getSSCircle(Res.get_small(Res.S_Type.Grain, Res.S_Color.Blue, Res.Sprite_Mode.Overlay), 1);
        const sss = [ss0, ss1];
        const cf0 = clone(template_config_bullet);
        const cf1 = clone(template_config_bullet);
        cf0.listener = move_point_event_listener_template();
        cf1.listener = move_point_event_listener_template();
        const refcf0 = clone(reflect_config_default);
        const refcf1 = clone(reflect_config_default);
        refcf0.max = 2;
        refcf0.h0 = -Infinity;
        refcf1.max = 1;
        refcf1.h0 = -Infinity;
        reflect_linear(refcf0)(cf0.listener);
        reflect_linear(refcf1)(cf1.listener);

        const n0 = 4, n1 = 8;
        const mx = 0.5;
        const v = 6 / time_scale;
        const ti0 = 1 * time_scale;
        const ti1 = 3 * time_scale;

        const rm: MoverConfig = {
            duration: 40 * time_scale,
            px0: -96,
            px1: 96,
            py0: 32,
            py1: 112,
            dx1: 64,
            dy1: 64,
            ease: (a: number) => (1 - Math.cos(Math.PI * a)) / 2
        }

        const boss = new MovePoint(SRes.getSSCircle(Res.boss_background, 2), template_config_bullet)
            .setMotion((e) => (e.dir = e.time * Math.PI * 2 / 600, false)).simpleInit(0, 64, 0, 0);

        var a0 = 0;

        const add = (ssi: SSPoint<ShapeCircle>, m: number, dir: number, cf: MovePointConfig) => repeat((i0) => [
            nonblock([repeat((i1) => [
                repeat((i2) => [() => EntityPool.INSTANCE.add(new MovePoint(ssi, cf)
                    .simpleInit(boss.px, boss.py, v, a0 + dir * Math.PI * 2 * (i0 / n1 / n0 + i2 / n0 + i1 / n0 / n1 / m * mx)))], n1),
                ti0
            ], m)]),
            ti1
        ], n1);

        return new Scheduler([
            () => EntityPool.INSTANCE.add(boss),
            30 * time_scale,
            repeat((ix) => [
                () => a0 = Math.random() * Math.PI * 2,
                add(sss[0], 10, 1, cf0),
                ti0 * 10,
                Mover.random(boss, rm),
                add(sss[1], 15, -1, cf1),
                ti0 * 20,
                Mover.random(boss, rm)
            ])
        ]);
    }
}