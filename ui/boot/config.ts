import * as ko from "knockout";
import { ApplicationMenus as ApplicationMenus } from "../menus/menus";
//import { EventHandler as EventHandler } from "../../event-handler";

export class Spa
{
  constructor()
  {
    this.registerComponents();
    ko.applyBindings();
    var menu = remote.Menu;
    var applicationMenus = new ApplicationMenus();
    var currentMenuTemplate = menu.buildFromTemplate(applicationMenus.menuTemplate);
    menu.setApplicationMenu(currentMenuTemplate);
  }

  public registerComponents() {
      this.registerComponent("home-page", "components/home-page/home-page");
      this.registerComponent("stats-panel", "components/stats-panel/stats-panel");
  }

  public registerComponent(name: string, location: string)
  {
    ko.components.register(name, { require: location });
  }
}
