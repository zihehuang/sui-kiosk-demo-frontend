import { useQuery } from "@tanstack/react-query";

import { SuiObjectDisplay } from "@/components/SuiObjectDisplay";
import { KioskContent } from "./KioskContent";
import { QueryKey } from "@/constants";
import { InfiniteScrollArea } from "@/components/InfiniteScrollArea";
import { CardStackPlusIcon, ArrowUpIcon, ArrowDownIcon, CheckCircledIcon, Cross1Icon } from "@radix-ui/react-icons";
import { ExplorerLink } from "../ExplorerLink";
import { useState } from "react";
import { Button } from "@radix-ui/themes";
import { KioskClient, Network, KioskItem } from "@mysten/kiosk";
// import { KioskObject } from "./LockedObject";
import { SuiClient } from '@mysten/sui.js/client';

const kioskId = "0x04cd6eb31412be249cfd1a246c423307652873687383a026c541caa2014869f1"

/**
 * Similar to the `ApiLockedList` but fetches the owned locked objects
 * but fetches the objects from the on-chain state, instead of relying on the indexer API.
 */
export function KioskList() {
  // const account = useCurrentAccount();
  const client = new SuiClient({url: "https://fullnode.testnet.sui.io:443"});

  const kioskClient = new KioskClient({
    client,
    network: Network.TESTNET,
  });



  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.Kiosk, kioskId],
      queryFn: async () => {
        const res = await kioskClient.getKiosk({
          id: kioskId,
          options: {
              withKioskFields: true, // this flag also returns the `kiosk` object in the response, which includes the base setup
              withListingPrices: true, // This flag enables / disables the fetching of the listing prices.
          }
        });
        return res;
      },
    select: (data) => data.items,
  });

  const getLabel = (item: KioskItem) => {
    if (item.isLocked) return "Locked";
    return undefined;
  };
  const getLabelClasses = () => {
    return "bg-green-50 rounded px-3 py-1 text-sm text-green-700";
  };

  const [isToggled, setIsToggled] = useState(true);

  return (
    <>
      <InfiniteScrollArea
        loadMore={() => {}}
        hasNextPage={false}
        loading={isLoading}
      >
        {data?.map((kioskItem) => (
          <SuiObjectDisplay
            object={kioskItem.data}
            label={getLabel(kioskItem)}
            labelClasses={getLabelClasses()}
          >
            <div className="flex gap-3 flex-wrap">
              {
                <p className="text-sm flex-shrink-0 flex items-center gap-2">
                  <ExplorerLink id={kioskItem.objectId} isAddress={false} />
                </p>
              }
              <Button
                className="ml-auto cursor-pointer bg-transparent text-black"
                onClick={() => setIsToggled(!isToggled)}
              >
                Details
                {isToggled ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </Button>
              <div className="min-w-[340px] w-full justify-self-start text-left">
                {kioskItem?.data && (
                  <KioskContent kioskContent={{...kioskItem}} />
                )}
              </div>
            </div>
          </SuiObjectDisplay>
        ))}
      </InfiniteScrollArea>
    </>
  );
}
