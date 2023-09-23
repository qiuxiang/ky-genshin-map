import { createRoot } from "react-dom/client";
import { useSnapshot } from "valtio";
import { AreaPicker } from "./area-picker";
import { Drawer } from "./drawer";
import { initStore, store } from "./store";
import { GenshinMap } from "./tilemap";

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

Neutralino.init();
Neutralino.events.on("windowClose", () => Neutralino.app.exit());

initStore();
createRoot(document.getElementById("main")!).render(<Main />);
