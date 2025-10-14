
import { GfxDevice } from "../gfx/platform/GfxPlatform.js";
import { SceneContext, SceneDesc, SceneGroup } from "../SceneBase.js";
import { SourceFileSystem, SourceLoadContext } from "./Main.js";
import { createScene } from "./Scenes.js";
import { createKitchenSinkSourceFilesytem } from "./Scenes_FileDrops.js";

import { TeamFortress2SceneDesc, HalfLife2SceneDesc, HalfLife2Ep2SceneDesc, CounterStrikeGOSceneDesc, DayOfDefeatSceneDesc } from "./Scenes_SourceDescs.js";

const id = 'TuesdayManifest';
const name = 'Tuesday Manifest';
const sceneDescs = [
    "Team Fortress 2",
    new TeamFortress2SceneDesc('tf_data', 'data - Landscape'),
    new TeamFortress2SceneDesc('tf_data2', 'data2 - ELX'),
    new TeamFortress2SceneDesc('tf_data3', 'data3 - Shattered Buildings - Unfixed Lighting'),
	new TeamFortress2SceneDesc('tf_data3_d', 'data3 - Shattered Buildings - Fixed Lighting'),
    new TeamFortress2SceneDesc('tf_data4', 'data4 - Box'),
    new TeamFortress2SceneDesc('tf_data5', 'data5 - Heavy Torus'),
    new TeamFortress2SceneDesc('tf_data6', 'data6 - City - Unfixed Lighting'),
	new TeamFortress2SceneDesc('tf_data6_d', 'data6 - City - Fixed Lighting'),
    new TeamFortress2SceneDesc('tf_data7', 'data7 - Gravel Grave'),

    "Half-Life 2",
    new HalfLife2SceneDesc('hl2_data', 'data - Area Portal'),
    
    "Half-Life 2: Episode 2",
    new HalfLife2Ep2SceneDesc('ep2_data', 'data - Hi Guy'),
    new HalfLife2Ep2SceneDesc('ep2_data2', 'data2 - Fear Inc.'),
    
    "Counter Strike: Global Offensive",
    new CounterStrikeGOSceneDesc('csgo_data', 'data - Training Course'),
    new CounterStrikeGOSceneDesc('csgo_data2', 'data2 - Bowl'),
    new CounterStrikeGOSceneDesc('csgo_data3', 'data3 - Office Head'),
    
    "Day of Defeat",
    new DayOfDefeatSceneDesc('dod_data', 'data - Maze'),

    "Source Filmmaker",


];

export const sceneGroup: SceneGroup = { id, name, sceneDescs };
