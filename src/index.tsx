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
      <AreaPicker />
      <Drawer />
    </>
  );
}

initStore();
createRoot(document.getElementById("main")!).render(<Main />);
