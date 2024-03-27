import { useQuery } from "@tanstack/react-query";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { SuiObjectDisplay } from "@/components/SuiObjectDisplay";
import { KioskContent } from "./KioskContent";
import { QueryKey } from "@/constants";
import { InfiniteScrollArea } from "@/components/InfiniteScrollArea";
import { ExplorerLink } from "../ExplorerLink";
import { Button } from "@radix-ui/themes";
import { KioskClient, Network, KioskItem } from "@mysten/kiosk";
// import { KioskObject } from "./LockedObject";
import { SuiClient } from "@mysten/sui.js/client";
import { usePurchaseItemMutation } from "@/mutations/kiosk";
import { CONSTANTS } from "@/constants";

/**
 * Similar to the `ApiLockedList` but fetches the owned locked objects
 * but fetches the objects from the on-chain state, instead of relying on the indexer API.
 */
export function KioskList({ kioskId }: { kioskId: string }) {
  const { mutate: purchaseMutation, } = usePurchaseItemMutation();
  const account = useCurrentAccount();
  const client = new SuiClient({ url: CONSTANTS.testnetUrl });

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
        },
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
                className="ml-auto cursor-pointer"
                disabled={false}
                onClick={() => {
                  purchaseMutation({
                    buyer: account?.address!,
                    kioskId: kioskId,
                    id: kioskItem.objectId,
                  });
                }}
              >
                Buy now
              </Button>
              <div className="min-w-[340px] w-full justify-self-start text-left">
                {kioskItem?.data && (
                  <KioskContent kioskContent={{ ...kioskItem }} />
                )}
              </div>
            </div>
          </SuiObjectDisplay>
        ))}
      </InfiniteScrollArea>
    </>
  );
}
