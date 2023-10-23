import {
  ArrowDownTrayIcon,
  DocumentIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { proxy, useSnapshot } from "valtio";
import { exportData, importData } from "./genshin-map/state";
import { activateArea, store } from "./store";

interface AreaConfig {
  icon: string;
  color: string;
}

const areas: Record<string, AreaConfig> = {
  蒙德: { icon: require("../images/mondstadt.png"), color: "#60fff5" },
  璃月: { icon: require("../images/liyue.png"), color: "#ffdc60" },
  稻妻: { icon: require("../images/inazuma.png"), color: "#9360ff" },
  须弥: { icon: require("../images/sumeru.png"), color: "#afff60" },
  枫丹: { icon: require("../images/fontaine.png"), color: "#52e5ff" },
};

const state = proxy({ visible: false });

function toggleAreaPicker() {
  state.visible = !state.visible;
}

export function closeAreaPicker() {
  state.visible = false;
}

export function AreaPicker() {
  const { activeTopArea, activeSubArea, mapData } = useSnapshot(store);
  const { visible } = useSnapshot(state);

  if (activeTopArea == null) {
    return null;
  }

  const iconClassName = "w-8 h-8 text-white";
  return (
    <>
      <div
        className={classNames(
          "absolute pointer-events-none w-full h-16 md:h-20 bg-gradient-to-b from-black/50 to-transparent"
        )}
      />
      <div
        className={classNames(
          "absolute h-16 md:h-20 flex items-center gap-4 ease-out duration-300",
          visible ? "opacity-0 -left-20" : "opacity-100 left-4"
        )}
      >
        <DocumentPlusIcon
          className={iconClassName}
          title="导入存档"
          onClick={importData}
        />
        <ArrowDownTrayIcon
          className={iconClassName}
          title="导出存档"
          onClick={exportData}
        />
      </div>
      <div
        className={classNames(
          "absolute h-16 md:h-20 flex items-center ease-out duration-300",
          visible ? "opacity-0 -right-20" : "opacity-100 right-4"
        )}
        onClick={toggleAreaPicker}
      >
        <div className="flex-1 flex flex-col pt-1 mr-4 items-end justify-center">
          <div className="text-white flex items-center">
            <div className="rounded-full px-2 h-6 bg-black/50 mr-2 flex items-center">
              <img
                className="w-5 md:h-5 mr-1"
                src={require("../images/icon-compass.png")}
              />
              <div className="leading-none text-sm">更换地区</div>
            </div>
            <div className="text-xl md:text-2xl font-semibold">
              {activeTopArea.getName()}
            </div>
          </div>
          <div
            className="text-yellow-400 font-bold text-sm md:text-base"
            style={{ textShadow: "0 0 2px #000" }}
          >
            当前选择 -{" "}
            {activeSubArea
              ? activeSubArea.getName()
              : `${activeTopArea.getName()}全地区`}
          </div>
        </div>
        <img
          className="w-12 h-12 md:w-16 md:h-16"
          src={areas[activeTopArea.getName()].icon}
        />
      </div>
      <div
        className={classNames(
          "absolute w-full h-16 md:h-20 flex items-center justify-center ease-out duration-300",
          visible ? "top-0 opacity-100" : "-top-20 md:-top-16 opacity-0"
        )}
        style={{
          background:
            "linear-gradient(90deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.5) 50%,rgba(0,0,0,0) 100%)",
        }}
      >
        {mapData.getAreaList().map((topArea) => {
          return (
            <div
              key={topArea.getName()}
              className="mx-2 relative w-11 h-11 md:w-14 md:h-14 flex justify-center items-center"
              onClick={() => {
                activateArea(topArea);
              }}
            >
              <>
                <img
                  className="w-full h-full absolute top-0 left-0 ease-out duration-300"
                  src={areas[topArea.getName()].icon}
                />
                <div
                  className={classNames(
                    "absolute w-1/2 h-1/2 bg-white hover:opacity-100 duration-300 ease-out",
                    activeTopArea == topArea ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    filter: "blur(10px)",
                    backgroundColor: areas[topArea.getName()].color,
                  }}
                />
              </>
            </div>
          );
        })}
        {visible && (
          <div
            className={classNames(
              "absolute top-16 md:top-20 px-8 py-2 flex flex-wrap gap-2 justify-center"
            )}
          >
            {activeTopArea.getChildList().map((subArea) => (
              <div
                key={subArea.getName()}
                className={classNames(
                  "py-0.5 px-4 rounded-full bg-black/50 text-white font-semibold text-sm border-1 border-solid hover:border-white ease-out duration-300",
                  activeSubArea == subArea
                    ? "border-white"
                    : "border-transparent"
                )}
                onClick={() => {
                  activateArea(subArea);
                }}
              >
                {subArea.getName()}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
