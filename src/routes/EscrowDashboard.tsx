// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useState } from "react";
import { Tabs, Tooltip } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { KioskList } from "@/components/kiosk/KioskList";
import { CONSTANTS } from "@/constants";

const primaryKioskId = CONSTANTS.primaryKioskId;
const secondaryKioskId = CONSTANTS.secondaryKioskId;

export function EscrowDashboard() {
  const tabs = [
    {
      name: "Primary Market Kiosk",
      component: () => <KioskList kioskId={primaryKioskId} />,
      tooltip: "Kiosk items from the Minter Kiosk.",
    },
    {
      name: "Secondary Market Kiosk",
      component: () => <KioskList kioskId={secondaryKioskId} />,
      tooltip: "Browse items from the Collector Kiosk.",
    },
    // {
    //   name: "My Pending Requests",
    //   component: () => (
    //     <EscrowList
    //       params={{
    //         sender: account?.address,
    //         swapped: "false",
    //         cancelled: "false",
    //       }}
    //     />
    //   ),
    //   tooltip: "Escrows you have initiated for third party locked objects.",
    // },
  ];

  const [tab, setTab] = useState(tabs[0].name);

  return (
    <Tabs.Root value={tab} onValueChange={setTab}>
      <Tabs.List>
        {tabs.map((tab, index) => {
          return (
            <Tabs.Trigger
              key={index}
              value={tab.name}
              className="cursor-pointer"
            >
              {tab.name}
              <Tooltip content={tab.tooltip}>
                <InfoCircledIcon className="ml-3" />
              </Tooltip>
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>
      {tabs.map((tab, index) => {
        return (
          <Tabs.Content key={index} value={tab.name}>
            {tab.component()}
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
}
