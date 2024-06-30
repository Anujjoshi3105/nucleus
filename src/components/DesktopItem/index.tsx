"use client";

import React from "react";
import clsx from "clsx";
import Link from "next/link";

interface DesktopItemProps {
  label: String;
  icon: any;
  href: String;
  onclick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon:Icon,
  href,
  onclick,
  active,
}) => {
  const handleClick = () => {
    if (onclick) {
      return onclick();
    }
  };
  return (
    <li onClick={handleClick}>
      <Link href={href}
        className={clsx(`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-blue`,active && `bg-gray-100 text-blue` )}>
        <Icon classname='h-6 w-6 shrink-0'/>
        <span>{label}</span>
       
      </Link>
    </li>
  );
};

export default DesktopItem;
