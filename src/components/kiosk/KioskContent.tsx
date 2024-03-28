// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import {KioskItem } from "@mysten/kiosk";
import { Avatar, Box, Card, Flex, Inset, Text } from "@radix-ui/themes";
import { ReactNode } from "react";
import { ExplorerLink } from "../ExplorerLink";

/**
 * A Card component to view an object's Display (from on-chain data).
 * It includes a label on the top right of the card that can be styled.
 *
 * It also allows for children to be passed in, which will be displayed
 * below the object's display in a footer-like design.
 *
 */
export function KioskObjectDisplay({
  object,
  children,
  label,
  labelClasses,
}: {
  object?: KioskItem;
  children?: ReactNode | ReactNode[];
  label?: string;
  labelClasses?: string;
}) {
  const tier3Url = "https://suifrens.com/images/bull-shark-about.svg"
  const tier2Url = "https://testnet.suifrens.com/images/capy-about.svg"


  const listingPrice = object?.listing?.price;
  let fields: any
  if(object?.data?.content?.dataType === "moveObject") {
    fields = object?.data?.content?.fields
  }
  const imgUrl = fields.tier === 3 ? tier3Url : tier2Url
  return (
    <Card className="!p-0 sui-object-card">
      {label && (
        <div className={`absolute top-0 right-0 m-2 ${labelClasses}`}>
          {label}
        </div>
      )}
      <Flex gap="3" align="center">
        <Avatar size="6" radius="full" fallback="O" src={imgUrl} />
        <Box className="grid grid-cols-1">
          <Text className="text-xs">
            <ExplorerLink id={object?.objectId || ""} isAddress={false} />
          </Text>

          <Text as="div" size="2" weight="bold">
            Season: {fields.season || "-"}
          </Text>
          <Text as="div" size="2" weight="bold">
            Tier: {fields.tier || "-"}
          </Text>

          {listingPrice && (
          <Text as="div" size="2" color="gray">
            { +listingPrice / (10**9) || "unknown"} SUI
          </Text>
          )}
        </Box>
      </Flex>
      {children && (
        <Inset className="p-2 border-t mt-3 bg-gray-100 rounded-none">
          {children}
        </Inset>
      )}
    </Card>
  );
}
