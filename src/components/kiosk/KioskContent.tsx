// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectDisplay } from "@/components/SuiObjectDisplay";
import { Button } from "@radix-ui/themes";
import { KioskItem } from "@mysten/kiosk";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  LockOpen1Icon,
} from "@radix-ui/react-icons";
import { ExplorerLink } from "../ExplorerLink";
import { useState } from "react";

/**
 *
 * This can also render data directly from the API, but we prefer
 * to also validate ownership from on-chain state (as objects are transferrable)
 * and the API cannot track all the ownership changes.
 */
export function KioskContent({
  kioskContent,
}: {
  kioskContent: KioskItem;
}) {
  const [isToggled, setIsToggled] = useState(false);
  const account = useCurrentAccount();
  // const { mutate: unlockMutation, isPending } = useUnlockMutation();

  const suiObject = useSuiClientQuery(
    "getObject",
    {
      id: kioskContent.objectId,
      options: {
        showDisplay: true,
        showType: true,
        showOwner: true,
      },
    },
    {
      select: (data) => data.data,
    },
  );

  const getLabel = () => {
    if (kioskContent.isLocked) return "Locked";
    return undefined;
  };

  const getLabelClasses = () => {
    if (kioskContent.isLocked)
      return "bg-red-50 rounded px-3 py-1 text-sm text-red-500";
    return undefined;
  };

  return (
    <SuiObjectDisplay
      object={suiObject.data!}
      label={getLabel()}
      labelClasses={getLabelClasses()}
    >
      <div className="text-right flex flex-wrap items-center justify-between">
        {
          <p className="text-sm flex-shrink-0 flex items-center gap-2">
            <ExplorerLink id={kioskContent.objectId} isAddress={false} />
          </p>
        }
      </div>
    </SuiObjectDisplay>
  );
}
