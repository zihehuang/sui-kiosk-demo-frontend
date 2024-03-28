// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/**
 * Takes an object of { key: value } and builds a URL param string.
 * e.g. { page: 1, limit: 10 } -> ?page=1&limit=10
 */
export const constructUrlSearchParams = (
  object: Record<string, string>,
): string => {
  const searchParams = new URLSearchParams();

  for (const key in object) {
    searchParams.set(key, object[key]);
  }

  return `?${searchParams.toString()}`;
};

/** Checks whether we have a next page */
export const getNextPageParam = (lastPage: any) => {
  if ("api" in lastPage) {
    return lastPage.api.cursor;
  }
  return lastPage.cursor;
};

export function shortenHash(longStr: string | null | undefined): string {
  if (!longStr) return ''
  return longStr.length >= 10 ? longStr.slice(0, 6) + '...' + longStr.slice(-4) : longStr
}

export function shorten(longStr: string | null | undefined): string {
  if (!longStr) return ''
  return longStr.replace(/0x([A-E0-9]|)\w+/g, shortenHash)
}
