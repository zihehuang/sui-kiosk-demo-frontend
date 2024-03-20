import { CONSTANTS, QueryKey } from "@/constants";
import { useTransactionExecution } from "@/hooks/useTransactionExecution";
import { ApiEscrowObject, ApiLockedObject } from "@/types/types";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui.js/client";
import { KioskTransaction, KioskClient, Network } from "@mysten/kiosk";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SuiClient } from '@mysten/sui.js/client';

const client = new SuiClient({url: CONSTANTS.testnetUrl});
const kioskClient = new KioskClient({
	client,
	network: Network.TESTNET,
});

export function usePurchaseItemMutation() {
  const executeTransaction = useTransactionExecution();
  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: async ({
      buyer,
      kioskId,
      id
    }: {
      buyer: string;
      kioskId: string;
      id: string;
    }) => {
      const { kioskOwnerCaps: userKioskCaps } =
        await kioskClient.getOwnedKiosks({ address: buyer });
      console.log("User kiosk caps: ", userKioskCaps);

      const tx = new TransactionBlock();
      const kioskTx = new KioskTransaction({
	transactionBlock: tx,
	kioskClient,
	cap: userKioskCaps[0],
      });

      if (userKioskCaps.length === 0) {
	kioskTx.create();
      }
      await kioskTx.purchaseAndResolve({
	itemType: `${CONSTANTS.packageId}::trading_pack::TradingPack`,
	itemId: id,
	price: "100000000", // this should be saved from when we listed.
	sellerKiosk: kioskId,
      });

      if (userKioskCaps.length === 0) {
	kioskTx.shareAndTransferCap(buyer);
      }

      kioskTx.finalize();

      return executeTransaction(kioskTx.transactionBlock);
    },
    onSuccess: () => {
      setTimeout(() => {
        // invalidating the queries after a small latency
        // because the indexer works in intervals of 1s.
        // if we invalidate too early, we might not get the latest state.
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Locked],
        });
      }, 1_000);
    },
  });
}

export function useListItemMutation() {
  const executeTransaction = useTransactionExecution();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      accountAddress,
      itemId,
    }: {
      accountAddress: string;
      itemId: string;
    }) => {
      const { kioskOwnerCaps: userKioskCaps } =
        await kioskClient.getOwnedKiosks({ address: accountAddress });
      console.log("User kiosk caps: ", userKioskCaps);

      const tx = new TransactionBlock();
      const kioskTx = new KioskTransaction({
	transactionBlock: tx,
	kioskClient,
	cap: userKioskCaps[0],
      });

      kioskTx.list({
	itemType: `${CONSTANTS.packageId}::trading_pack::TradingPack`,
	itemId,
	price: 100000000n,
      });

      kioskTx.finalize();

      return executeTransaction(kioskTx.transactionBlock);
    },
    onSuccess: () => {
      setTimeout(() => {
	// invalidating the queries after a small latency
	// because the indexer works in intervals of 1s.
	// if we invalidate too early, we might not get the latest state.
	queryClient.invalidateQueries({
	  queryKey: [QueryKey.Locked],
	});
      }, 1_000);
    },
  });
}
