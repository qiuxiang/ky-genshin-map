import { createRoot } from "react-dom/client";
import { useSnapshot } from "valtio";
import { AreaPicker, closeAreaPicker } from "./area-picker";
import { closeDrawer, Drawer } from "./drawer";
import { GenshinMap } from "./genshin-map";
import { initStore, store } from "./store";

function Main() {
  const { mapData } = useSnapshot(store);
  if (!mapData) return null;

  return (
    <>
      <GenshinMap />
      <div className="absolute pointer-events-none top-0 w-full h-16 md:h-20 bg-gradient-to-b from-black/50 to-transparent" />
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

initStore();
createRoot(document.getElementById("main")!).render(<Main />);
