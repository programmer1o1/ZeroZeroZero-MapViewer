import { SourceRenderer, SkyboxRenderer, BSPRenderer, SourceRenderContext, SourceLoadContext } from "./Main.js";
import { SceneContext } from "../SceneBase.js";
import { BSPFile } from "./BSPFile.js";
import { assertExists } from "../util.js";

export async function createScene(context: SceneContext, loadContext: SourceLoadContext, mapId: string, mapPath: string, loadMapFromVpk: boolean = false): Promise<SourceRenderer> {
    const filesystem = loadContext.filesystem;

    filesystem.pakfiles.length = 0;

    const renderContext = new SourceRenderContext(context.device, loadContext);
    const renderer = new SourceRenderer(context, renderContext);

    // load bsp and initialize renderer in parallel
    const [bspFile] = await Promise.all([
        context.dataShare.ensureObject(`SourceEngine/${mapPath}`, async () => {
            const bsp = loadMapFromVpk ? assertExists(await filesystem.fetchFileData(mapPath)) : await context.dataFetcher.fetchData(mapPath);
            return new BSPFile(bsp, mapId, loadContext.bspFileVariant);
        })
    ]);

    if (bspFile.pakfile !== null)
        filesystem.addPakFile(bspFile.pakfile);

    // start cubemap binding but don't wait for it
    const cubemapPromise = bspFile.cubemaps[0] !== undefined 
        ? renderContext.materialCache.bindLocalCubemap(bspFile.cubemaps[0])
        : Promise.resolve();

    const bspRenderer = new BSPRenderer(renderContext, bspFile);
    
    // start skybox creation but don't block on texture loading
    const worldspawn = bspRenderer.getWorldSpawn();
    if (worldspawn.skyname) {
        renderer.skyboxRenderer = new SkyboxRenderer(renderContext, worldspawn.skyname);
    }
    
    renderer.bspRenderers.push(bspRenderer);
    
    // ensure cubemap is ready before returning
    await cubemapPromise;
    
    return renderer;
}