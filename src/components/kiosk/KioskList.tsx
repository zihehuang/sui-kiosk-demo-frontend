import { useQuery } from "@tanstack/react-query";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { QueryKey } from "@/constants";
import { InfiniteScrollArea } from "@/components/InfiniteScrollArea";
import { ExplorerLink } from "../ExplorerLink";
import { Button } from "@radix-ui/themes";
import { KioskClient, Network, KioskItem } from "@mysten/kiosk";
import { SuiClient } from "@mysten/sui.js/client";
import { usePurchaseItemMutation } from "@/mutations/kiosk";
import { CONSTANTS } from "@/constants";
import { KioskObjectDisplay } from "./KioskContent";

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
	  withObjects: true,
	  objectOptions: {
	    showContent: true,
	  }
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
          <KioskObjectDisplay
            object={kioskItem}
            label={getLabel(kioskItem)}
            labelClasses={getLabelClasses()}
          >
            <div className="flex gap-3 flex-wrap">
              {
                <p className="text-sm flex-shrink-0 flex items-center gap-2">
                  <ExplorerLink id={kioskItem.objectId} isAddress={false} />
                </p>
              }
              {kioskItem.listing && (<Button
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
	      )}
	      {kioskItem.listing == undefined && (
	        <label className="ml-auto text-sm text-red-700">
	          Not Listed
	        </label>
	      )}
            </div>
          </KioskObjectDisplay>
        ))}
      </InfiniteScrollArea>
    </>
  );
}
