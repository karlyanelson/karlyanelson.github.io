---
lastUpdated: 2025-01-29
tags: post
emoji: 💵
title: How to use node-cache to cache data for a set time period
description: If you have a loop where you're fetching, and don't want to unnecessarily fetch up-to-date data you just grabbed, you can use node-cache to easily save it to a temporary cache and roll off old data.
techStack:
  - name: Node
    version: 20.11
    url: https://nodejs.org/en
  - name: node-cache
    version: 5.1.2
    url: https://github.com/node-cache/node-cache
---

## The Problem

You have a loop where you're fetching, and don't want to unnecessarily fetch up-to-date data you just grabbed, so you want to easily save it to a temporary cache and roll off old stale data.

## Solution Summary

Use [node-cache](https://github.com/node-cache/node-cache) package

## The Explanation

1. Import `NodeCache` from "node-cache"
2. Instanstiate a `new NodeCache()` in a constant outside the scope of the function you want to cache. This will make sure it's stored in the app state, and not recreated every time the function is called.
3. Set your `NodeCache` options - `stdTTL` is the amount seconds you want data in the cache to be around, `checkperiod` is how often it checks for stale data to delete
4. In your function, make a unique `cacheKey` to use to grab items from the cache
5. Check if you have anything in the cache at that key with `cache.get`. If so, just return that.
6. If not, do your thing to get the data (in the example below it's `someAsyncFunction`)
7. Add that data to the cache at its unique key with `cache.set`
8. Congratulations you have a cache!

```js
import NodeCache from "node-cache";

const defaultCacheOptions = {
  stdTTL: 60, // Leave data around for 60s / 1 minute
  checkperiod: 120, // Check for expired data every 120s / 2 minutes
};

const cache = new NodeCache(defaultCacheOptions);

const getData = async (param1, param2) => {
  const cacheKey = `${param1}_${param2}`;

  const cachedItem = cache.get(cacheKey);
  if (cachedItem) return cachedItem;

  const data = await someAsyncFunction(param1, param2);

  cache.set(cacheKey, data);

  return data;
};

export const myFunctionDoingAThing = async (items) {
  for (item of items) {
    await getData(item.param1, item.param2)
  }
};


```

### Specific Example

Let's say you're looping through transactions for many blocks on the blockchain, and you want to call the `getAddressBalance` function on any address that appears in a transaction so you can put that balance into a database for that block. You really only need to do that once per address per block number, because that data will be the same for that address for the whole block. If address `0x1234` appears in multiple transactions, without a cache we'd call `getAddressBalance` each time for that address and block, whereas we only need to actually call it once.

**Example Blocks and Transactions**

- Block #1
  - Transaction #1
    - From address = `0x1234`
    - To address = `0x5678`
  - Transaction #2
    - From address = `0x5678`
    - To address = `0x1234`
  - Transaction #3
    - From address = `0x1234`
    - To address = `0x5678`
- Block #2
  - Transaction #1
    - From address = `0x1234`
    - To address = `0xdef0`
  - Transaction #2
    - From address = `0xdef0`
    - To address = `0x1234`
  - Transaction #3
    - From address = `0x9abc`
    - To address = `0xdef0`

**Without** a cache, we'd call `getAddressBalance` for `0x1234` 3 times in Block #1, and 2 times in block #2.

**With** a cache, we'd call `getAddressBalance` for `0x1234` 1 time in Block #1, and 1 time in block #2.

Here's the example code below:

```ts
import NodeCache from "node-cache";

const defaultCacheOptions: NodeCache.Options = {
  stdTTL: 60, // Leave data around for 60s / 1 minute
  checkperiod: 120, // Check for expired data every 120s / 2 minutes
  useClones: false, // Doesn't use a copy, uses reference. Much more performant. Good if you're not mutating anything.
};

const cache = new NodeCache(defaultCacheOptions);

const getBalanceDataWithCache = async (address, blockNumber) => {
  const cacheKey = `${address}_${blockNumber}`;

  const cachedItem = cache.get<YourTypeHere>(cacheKey); // YourTypeHere is the type of the data in the cache

  if (cachedItem) return cachedItem; // If we already have the balance for that address in this block, we don't need it again

  const data = await getAddressBalance(address, blockNumber); // your function that gets the balance

  cache.set(cacheKey, data); // Add the balance at that address and block to the cache

  return data;
};

export async function getStuffFromTransactionsInABlock(
  transactions,
  blockNumber
) {
  for (transaction of transactions) {
    const fromBalance = await getBalanceDataWithCache(
      transaction.from,
      blockNumber
    );
    const toBalance = await getBalanceDataWithCache(
      transaction.to,
      blockNumber
    );

    upsertBalance(transaction.from, fromBalance, blockNumber);
    upsertBalance(transaction.to, toBalance, blockNumber);
  }
}
```

Our `getStuffFromTransactionsInABlock` will be called for each block, and pass in a bunch of transactions. We then fetch balances for the to/from address for each transaction using `getBalanceDataWithCache`. Our `cache` constant is set outside the scope of our other functions, so the cache will be held in the state of the app. We check our cache `cache.get` to see if we already fetched balances for that address at that block. Checking for the block and not just the address is necessary because `getStuffFromTransactionsInABlock` could potentially be run asynchronously - the app could be fetching balances from addresses for multiple blocks within the 1 minute period our cache keeps data.

#### Extra credit: Optimize further

We can optimize `getStuffFromTransactionsInABlock` further though.

First, let's call our two `getBalanceDataWithCache` asynchronously with [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

Secondly, let's save our balances to a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), to make them unique by address, before upserting into the database. This prevents the issue with our previous function, where we call `upsertBalance` even if we've already upserted for that address + balance combination for that block.

Thirdly, let's upsert all our balances at once, instead of individual upserts per address.

```ts
export async function getStuffFromTransactionsInABlock(
  transactions,
  blockNumber
) {
  const balanceMap = new Map<string, number>();

  for (transaction of transactions) {
    const [fromBalance, toBalance] = await Promise.all(
      getBalanceDataWithCache(transaction.from, blockNumber),
      getBalanceDataWithCache(transaction.to, blockNumber)
    );

    balanceMap.set(transaction.from, fromBalance);
    balanceMap.set(transaction.to, toBalance);
  }

  upsertBalances(balanceMap, blockNumber);
}
```
