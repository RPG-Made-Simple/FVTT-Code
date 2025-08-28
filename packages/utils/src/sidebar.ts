import { versionSwitchBehavior } from "./misc";

export interface SidebarTool {
  name: string;
  title: string;
  icon: string;
  toggle?: boolean;
  button?: boolean;
  order?: number;
  active?: boolean;
  visible: boolean;
  onEvent?: (event?: any, active?: boolean) => void;
}

export interface SidebarToolsOptions {
  id: string,
  title: string,
  icon: string,
  layer: string,
  visible: boolean,
  activeTool?: string,
}

let _sidebarToolsRendering = false;

/**
 * Setup sidebar tools.
 * @param tools the tools being added.
 * @param options the options.
 */
export function setupSidebarTools(
  tools: SidebarTool[],
  options: SidebarToolsOptions,
): undefined {
  Hooks.on('getSceneControlButtons', (controls) => {
    versionSwitchBehavior({
      v13: () => {
        const mappedTools: SceneControls.Tool[] = tools.map((t) => ({
          name: t.name,
          title: t.title,
          icon: t.icon,
          toggle: t.toggle,
          button: t.button,
          order: t.order,
          active: t.active,
          visible: t.visible,
          onChange: (event: any, active: boolean) => {
            t.onEvent?.(event, active);
          },
        }));

        const usableTools: Record<string, SceneControls.Tool> = {};
        mappedTools.forEach(t => usableTools[t.name] = t);

        const control: SceneControls.Control = {
          name: options.id,
          title: options.title,
          icon: options.icon,
          layer: options.layer,
          visible: options.visible,
          activeTool: options.activeTool as string,
          // @ts-ignore
          tools: usableTools,
        };

        // @ts-ignore
        controls[options.id] = control;
      },
    });
  });
}
