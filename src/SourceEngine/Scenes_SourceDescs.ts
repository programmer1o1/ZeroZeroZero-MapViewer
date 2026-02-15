import { GfxDevice } from "../gfx/platform/GfxPlatform.js";
import { SceneContext, SceneDesc, SceneGroup } from "../SceneBase.js";
import { SourceFileSystem, SourceLoadContext } from "./Main.js";
import { createScene } from "./Scenes.js";
import { createKitchenSinkSourceFilesytem } from "./Scenes_FileDrops.js";

const pakfilesPathBase = `paks`;
const tfPathBase = `TeamFortress2`;

// helper to load vpks with priority (critical first, optional later)
async function loadVPKsWithPriority(
    filesystem: SourceFileSystem,
    criticalVPKs: string[],
    optionalVPKs: string[] = []
): Promise<void> {
    // load critical vpks first
    await Promise.all(criticalVPKs.map(path => filesystem.createVPKMount(path)));
    
    // load optional vpks in background (don't wait)
    if (optionalVPKs.length > 0) {
        Promise.all(optionalVPKs.map(path => filesystem.createVPKMount(path))).catch(console.error);
    }
}

export class TeamFortress2SceneDesc implements SceneDesc {
    constructor(public id: string, public name: string = id) {
    }

    public async createScene(device: GfxDevice, context: SceneContext) {
        const filesystem = await context.dataShare.ensureObject(`${tfPathBase}/SourceFileSystem`, async () => {
            const filesystem = new SourceFileSystem(context.dataFetcher);
            
            // critical: textures and misc needed for rendering
            const critical = [
                `${pakfilesPathBase}/tf2/tf2_textures`,
                `${pakfilesPathBase}/tf2/tf2_misc`,
                `${pakfilesPathBase}/hl2/hl2_textures`,
                `${pakfilesPathBase}/hl2/hl2_misc`,
                `${pakfilesPathBase}/cstrike/cstrike_pak`,
                `${pakfilesPathBase}/tf2/plaza_materials`,
                `${pakfilesPathBase}/tf2/xmastextures`,
            ];
            
            // optional: sounds can load in background
            const optional = [
                `${pakfilesPathBase}/tf2/tf2_sound_misc`,
                `${pakfilesPathBase}/tf2/tf2_sound_vo_english`,
                `${pakfilesPathBase}/hl2/hl2_sound_misc`,
                `${pakfilesPathBase}/hl2/hl2_sound_vo_english`,
				`${pakfilesPathBase}/tf2/fortressfix`,
            ];
            
            await loadVPKsWithPriority(filesystem, critical, optional);
            return filesystem;
        });

        const loadContext = new SourceLoadContext(filesystem);
        return createScene(context, loadContext, this.id, `maps/tf/maps/${this.id}.bsp`);
    }
}

export class CGESceneDesc implements SceneDesc {
    constructor(public id: string, public name: string = id, private mapPath: string | null = null) {
    }

    public async createScene(device: GfxDevice, context: SceneContext) {
        const filesystem = await context.dataShare.ensureObject(`${pakfilesPathBase}/SourceFileSystem`, async () => {
            const filesystem = new SourceFileSystem(context.dataFetcher);
            
            const critical = [
                `${pakfilesPathBase}/tf2/tf2_textures`,
                `${pakfilesPathBase}/tf2/tf2_misc`,
                `${pakfilesPathBase}/hl2/hl2_textures`,
                `${pakfilesPathBase}/hl2/hl2_misc`,
                `${pakfilesPathBase}/tf2/plaza_materials`,
                `${pakfilesPathBase}/tf2/xmastextures`,
            ];
            
            const optional = [
                `${pakfilesPathBase}/tf2/tf2_sound_misc`,
                `${pakfilesPathBase}/tf2/tf2_sound_vo_english`,
                `${pakfilesPathBase}/hl2/hl2_sound_misc`,
                `${pakfilesPathBase}/hl2/hl2_sound_vo_english`,
            ];
            
            await loadVPKsWithPriority(filesystem, critical, optional);
            return filesystem;
        });

        // ensure CS:S textures are available even if the filesystem was cached earlier.
        await filesystem.toggleVPKMount(`${pakfilesPathBase}/cstrike/cstrike_pak`, true);
        // force-load plaza/xmas VPKs even if the filesystem was cached earlier.
        await filesystem.toggleVPKMount(`${pakfilesPathBase}/tf2/plaza_materials`, true);
        await filesystem.toggleVPKMount(`${pakfilesPathBase}/tf2/xmastextures`, true);

        const loadContext = new SourceLoadContext(filesystem);
        const mapPath = this.mapPath ?? `maps/${this.id}/${this.id}.bsp`;
        return createScene(context, loadContext, this.id, mapPath);
    }
}

const pathRoot = `HalfLife2_2024`;
const pathHL2 = `${pathRoot}/hl2`;
const pathEp1 = `${pathRoot}/episodic`;
const pathEp2 = `${pathRoot}/ep2`;

export class HalfLife2Ep2SceneDesc implements SceneDesc {
    constructor(public id: string, public name: string = id) {
    }

    public async createScene(device: GfxDevice, context: SceneContext) {
        const filesystem = await context.dataShare.ensureObject(`${pathEp2}/SourceFileSystem`, async () => {
            const filesystem = new SourceFileSystem(context.dataFetcher);
            
            const critical = [
                `${pakfilesPathBase}/ep2/ep2_pak`,
                `${pakfilesPathBase}/hl2/hl2_textures`,
                `${pakfilesPathBase}/hl2/hl2_misc`,
            ];
            
            const optional = [
                `${pakfilesPathBase}/hl2/hl2_sound_misc`,
                `${pakfilesPathBase}/hl2/hl2_sound_vo_english`,
            ];
            
            await loadVPKsWithPriority(filesystem, critical, optional);
            return filesystem;
        });

        const loadContext = new SourceLoadContext(filesystem);
        return createScene(context, loadContext, this.id, `maps/ep2/maps/${this.id}.bsp`);
    }
}

export class HalfLife2SceneDesc implements SceneDesc {
    constructor(public id: string, public name: string = id) {
    }

    public async createScene(device: GfxDevice, context: SceneContext) {
        const filesystem = await context.dataShare.ensureObject(`${pathHL2}/SourceFileSystem`, async () => {
            const filesystem = new SourceFileSystem(context.dataFetcher);
            
            const critical = [
                `${pakfilesPathBase}/hl2/hl2_textures`,
                `${pakfilesPathBase}/hl2/hl2_misc`,
            ];
            
            const optional = [
                `${pakfilesPathBase}/hl2/hl2_sound_misc`,
                `${pakfilesPathBase}/hl2/hl2_sound_vo_english`,
            ];
            
            await loadVPKsWithPriority(filesystem, critical, optional);
            return filesystem;
        });

        const loadContext = new SourceLoadContext(filesystem);
        return createScene(context, loadContext, this.id, `maps/hl2/maps/${this.id}.bsp`);
    }
}

const cstrikePathBase = `CounterStrikeSource`;
export class CounterStrikeSourceSceneDesc implements SceneDesc {
    constructor(public id: string, public name: string = id) {
    }

    public async createScene(device: GfxDevice, context: SceneContext) {
        const filesystem = await context.dataShare.ensureObject(`${cstrikePathBase}/SourceFileSystem`, async () => {
            const filesystem = new SourceFileSystem(context.dataFetcher);
            
            const critical = [
                `${pakfilesPathBase}/cstrike/cstrike_pak`,
                `${pakfilesPathBase}/hl2/hl2_textures`,
                `${pakfilesPathBase}/hl2/hl2_misc`,
            ];
            
            const optional = [
                `${pakfilesPathBase}/hl2/hl2_sound_misc`,
                `${pakfilesPathBase}/hl2/hl2_sound_vo_english`,
            ];
            
            await loadVPKsWithPriority(filesystem, critical, optional);
            return filesystem;
        });
        
        const loadContext = new SourceLoadContext(filesystem);
        return createScene(context, loadContext, this.id, `maps/cstrike/maps/${this.id}.bsp`);
    }
}

const csgoPathBase = `CounterStrikeGO`;

export class CounterStrikeGOSceneDesc implements SceneDesc {
    constructor(public id: string, public name: string = id) {
    }
    
    public async createScene(device: GfxDevice, context: SceneContext) {
        const filesystem = await context.dataShare.ensureObject(`${csgoPathBase}/SourceFileSystem`, async () => {
            const filesystem = new SourceFileSystem(context.dataFetcher);
            
            const critical = [
                `${pakfilesPathBase}/csgo/pak01`,
                `${pakfilesPathBase}/hl2/hl2_textures`,
                `${pakfilesPathBase}/hl2/hl2_misc`,
            ];
            
            await loadVPKsWithPriority(filesystem, critical);
            return filesystem;
        });
        
        const loadContext = new SourceLoadContext(filesystem);
        return createScene(context, loadContext, this.id, `maps/csgo/maps/${this.id}.bsp`);
    }
}

const dodPathBase = `dod`;
export class DayOfDefeatSceneDesc implements SceneDesc {
    constructor(public id: string, public name: string = id) {
    }

    public async createScene(device: GfxDevice, context: SceneContext) {
        const filesystem = await context.dataShare.ensureObject(`${dodPathBase}/SourceFileSystem`, async () => {
            const filesystem = new SourceFileSystem(context.dataFetcher);
            
            const critical = [
                `${pakfilesPathBase}/dod/dod_pak`,
                `${pakfilesPathBase}/hl2/hl2_textures`,
                `${pakfilesPathBase}/hl2/hl2_misc`,
            ];
            
            const optional = [
                `${pakfilesPathBase}/hl2/hl2_sound_misc`,
                `${pakfilesPathBase}/hl2/hl2_sound_vo_english`,
            ];
            
            await loadVPKsWithPriority(filesystem, critical, optional);
            return filesystem;
        });

        const loadContext = new SourceLoadContext(filesystem);
        return createScene(context, loadContext, this.id, `maps/dod/maps/${this.id}.bsp`);
    }
}

export class GarrysModSceneDesc implements SceneDesc {
    constructor(public id: string, public name: string = id) {
    }

    public async createScene(device: GfxDevice, context: SceneContext) {
        const gmPathBase = `GarrysMod`;

        const filesystem = await context.dataShare.ensureObject(`${gmPathBase}/SourceFileSystem`, async () => {
            return createKitchenSinkSourceFilesytem(context.dataFetcher);
        });

        const loadContext = new SourceLoadContext(filesystem);
        return createScene(context, loadContext, this.id, `${gmPathBase}/maps/${this.id}.bsp`);
    }
}
