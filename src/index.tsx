const { fetch } = require("whatwg-fetch");
window.fetch = fetch;

import { createRoot } from "react-dom/client";
import { useSnapshot } from "valtio";
import { AreaPicker, closeAreaPicker } from "./area-picker";
import { closeDrawer, Drawer } from "./drawer";
import { GenshinMap } from "./genshin-map";
import { store } from "./store";

function Main() {
  const { mapData } = useSnapshot(store);
  if (!mapData) return null;

  return (
    <>
      <GenshinMap />
      <AreaPicker />
      <Drawer />
    </>
  );
}

if (typeof Neutralino != "undefined") {
  Neutralino.init();
  Neutralino.events.on("windowClose", () => Neutralino.app.exit());
}

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

document.body.addEventListener("click", ({ target }) => {
  if ((target as HTMLElement).tagName == "CANVAS") {
    closeAreaPicker();
    if (window.innerWidth < 768) {
      closeDrawer();
    }
  }
});

createRoot(document.getElementById("main")!).render(<Main />);
