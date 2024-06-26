// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useCurrentAccount, } from "@mysten/dapp-kit";
import { Button } from "@radix-ui/themes";
import { InfiniteScrollArea } from "@/components/InfiniteScrollArea";
import { CONSTANTS, QueryKey } from "@/constants";
import { ExplorerLink } from "../ExplorerLink";
import { SuiClient } from "@mysten/sui.js/client";
import { KioskClient, Network, KioskItem } from "@mysten/kiosk";
import { useQuery } from "@tanstack/react-query";
import { useListItemMutation } from "@/mutations/kiosk";
import { KioskObjectDisplay } from "./KioskContent";

/**
 * A component that fetches all the objects owned by the connected wallet address
 * and allows the user to lock them, so they can be used in escrow.
 */
export function MyKioskItems() {
  const account = useCurrentAccount();
  const client = new SuiClient({ url: CONSTANTS.testnetUrl });

  const { mutate: listItemMutation, } = useListItemMutation();
  const kioskClient = new KioskClient({
    client,
    network: Network.TESTNET,
  });

  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.Kiosk, account?.address!],
    queryFn: async () => {
      const { kioskOwnerCaps: userKioskCaps } =
        await kioskClient.getOwnedKiosks({ address: account?.address! });
      if (!userKioskCaps.length) return undefined;

      const kioskId = userKioskCaps[0].kioskId;

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
    select: (data) => data?.items,
  });

  const getLabel = (item: KioskItem) => {
    if (item.isLocked) return "Locked";
    return undefined;
  };
  const getLabelClasses = () => {
    return "bg-green-50 rounded px-3 py-1 text-sm text-green-700";
  };

  return (
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
	    {kioskItem.listing == undefined && (
            <Button
              className="ml-auto cursor-pointer"
              disabled={false}
              onClick={() => {
                listItemMutation({
                  accountAddress: account?.address!,
                  itemId: kioskItem.objectId,
                });
              }}
            >
              List for Sale
            </Button>
	    )}
	    {kioskItem.listing && (
	      <label className="ml-auto text-sm text-green-700">
	        Listed
	      </label>
	    )}
          </div>
        </KioskObjectDisplay>
      ))}
    </InfiniteScrollArea>
  );
}
