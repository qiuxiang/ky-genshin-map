import classNames from "classnames";
import { HTMLAttributes, useState } from "react";

interface Props
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  defaultValue?: boolean;
  label?: string;
  onChange: (value: boolean) => void;
}

export function Switch({
  defaultValue = false,
  label,
  onChange,
  ...props
}: Props) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div
      {...props}
      className={classNames(
        "h:5 md:h-6 gap-2 flex items-center",
        props.className as string
      )}
      onClick={() => {
        setValue(!value);
        onChange(!value);
      }}
    >
      <div className="w-8 h-4 md:w-10 md:h-5 relative">
        <img
          className={classNames("w-full absolute")}
          src={
            value
              ? require("../../images/switch-on.png")
              : require("../../images/switch-off.png")
          }
        />
      </div>
      <div
        className="text-white font-semibold text-xs md:text-base"
        style={{ textShadow: "1px 1px 1px #000" }}
      >
        {label}
      </div>
    </div>
  );
}
