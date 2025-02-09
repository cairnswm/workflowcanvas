import React from "react";
import { Activity, Database, GitFork, Square, StickyNote } from "lucide-react";

type NodeType = "action" | "state" | "decision" | "block" | "header" | "image" | "sticky";

interface NodeIconProps {
  type: NodeType;
}

const NodeIcon = ({ type }: NodeIconProps) => {
  switch (type) {
    case "action":
      return <Activity size={14} className="text-blue-500" />;
    case "state":
      return <Database size={14} className="text-green-500" />;
    case "decision":
      return <GitFork size={14} className="text-amber-500" />;
    case "block":
      return <Square size={14} className="text-gray-500" />;
    case "sticky":
      return <StickyNote size={14} className="text-yellow-500" />;
    default:
      return null;
  }
};

export const getNodeStyle = (type: NodeType) => {
  switch (type) {
    case "action":
      return "bg-white border-blue-400";
    case "state":
      return "bg-gray-50 border-green-400";
    case "decision":
      return "bg-white border-amber-400";
    case "block":
      return "bg-gray-200 border-gray-400";
    case "image":
      return "bg-sky-50 border-sky-400";
    case "sticky":
      return "bg-yellow-50 border-yellow-400";
    default:
      return "bg-white border-gray-200";
  }
};

export default NodeIcon;
