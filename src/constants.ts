// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// You can choose a different env (e.g. using a .env file, or a predefined list)
import demoContract from "../demo-contract.json";
import escrowContract from "../escrow-contract.json";

export enum QueryKey {
  Locked = "locked",
  Escrow = "escrow",
  GetOwnedObjects = "getOwnedObjects",
  Kiosk = "kiosk",
  GetDynamicField = "getDynamicField",
}

export const CONSTANTS = {
  escrowContract: {
    ...escrowContract,
    lockedType: `${escrowContract.packageId}::lock::Locked`,
    lockedKeyType: `${escrowContract.packageId}::lock::Key`,
    lockedObjectDFKey: `${escrowContract.packageId}::lock::LockedObjectKey`,
  },
  demoContract: {
    ...demoContract,
    demoBearType: `${demoContract.packageId}::demo_bear::DemoBear`,
  },
  apiEndpoint: "http://localhost:3000/",
  primaryKioskId:
    "0x04cd6eb31412be249cfd1a246c423307652873687383a026c541caa2014869f1",
  secondaryKioskId:
    "0x3a7c61892f07d96d3c499d03fe63f07f37546fcd56748fbe16b810ba1d922f30",
  packageId:
    "0x934f0f8e74298107d6faeb767ab7b8261c5bf3c44896f057a428389c8bbb03d8",
  testnetUrl: "https://fullnode.testnet.sui.io:443",
};
