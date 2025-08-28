export interface SidebarToolsOptions {
  id: string,
  title: string,
  icon: string,
  layer: string,
  visible: boolean,
  activeTool: string,
}

/**
 * Setup sidebar tools.
 * @param controls the controls being added.
 * @param tools the tools being added.
 * @param options the options.
 */
export function setupSidebarTools(
  controls: SceneControls.Control[],
  tools: SceneControls.Tool[],
  options: SidebarToolsOptions,
): undefined {
  const control: SceneControls.Control = {
    name: options.id,
    title: options.title,
    icon: options.icon,
    layer: options.layer,
    visible: options.visible,
    activeTool: options.activeTool,
    tools: tools,
  };

  // @ts-ignore
  controls[options.id] = control;
}
