"use client";
import { memo, ReactNode } from "react";
import { Handle, Position } from "reactflow";
import "./index.css";
import { Cake, PartyPopper } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export type TurboNodeData = {
  title: string;
  icon?: ReactNode;
  subline?: string;
};

const TurboNode = ({ data, sourcePosition, targetPosition }: any) => {
  const router = useRouter();

  return (
    <>
      <div
        className="wrapper gradient"
        onClick={() => {
          const searchParams = new URLSearchParams({
            name: data.name,
          });
          router.push(`?${searchParams.toString()}`);
        }}
      >
        <div
          className={cn(
            "inner w-56 py-2",
            data.gender.toLowerCase() === "female"
              ? "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-500 via-pink-500 to-pink-500"
              : "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500 via-emerald-500 to-cyan-500",
          )}
        >
          <div className="body py-2 ">
            <div className="flex py-5">
              <div className="ml-2 min-w-0 px-4">
                <div className="truncate text-lg font-bold text-gray-100">
                  {data.name}
                </div>
                <div className="flex text-gray-200">
                  <Cake className="mr-1 h-5 w-5" />
                  <span className="truncate whitespace-nowrap">
                    {data.birthDate}
                  </span>
                </div>

                <div className="flex truncate text-gray-200">
                  <PartyPopper className="mr-1 h-5 w-5" />
                  <span className="truncate whitespace-nowrap">
                    {data.bornIn}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Handle
            className=""
            type="target"
            position={targetPosition === "left" ? Position.Left : Position.Top}
          />
          <Handle
            type="source"
            position={
              sourcePosition === "right" ? Position.Right : Position.Bottom
            }
          />
        </div>
      </div>
    </>
  );
};
export default TurboNode;
