import { getAddress } from "viem/utils";
import { normalize } from "viem/ens";

import log from "loglevel";
import { getPublicClient } from "../publicClient";

export async function getENSName(_address: string) {
  const publicClient = getPublicClient(1);
  const address = getAddress(_address);

  return publicClient.getEnsName({ address });
}

export function resolveENSName(ensName: string) {
  const publicClient = getPublicClient(1);

  return publicClient.getEnsAddress({ name: normalize(ensName) });
}

export async function getENSDetails(address?: string | null) {
  if (!address) {
    return null;
  }

  try {
    const publicClient = getPublicClient(1);
    const walletAddress = getAddress(address);

    const ensName = await publicClient.getEnsName({ address: walletAddress });

    if (!ensName) {
      return null;
    }

    const name = normalize(ensName);

    const [
      avatar,
      description,
      discord,
      github,
      twitter,
      reddit,
      linkedin,
      emails,
    ] = await Promise.all(
      [
        "avatar",
        "description",
        "com.discord",
        "com.github",
        "com.twitter",
        "com.reddit",
        "com.linkedin",
        "emails",
      ].map(async (key) => publicClient.getEnsText({ name, key }))
    );

    const ensData = {
      avatar,
      description,
      discord,
      github,
      twitter,
      reddit,
      linkedin,
      emails,
      ens: name,
    };

    if (avatar?.startsWith("ipfs")) {
      ensData.avatar = `https://metadata.ens.domains/mainnet/avatar/${name}`;
    }

    return ensData;
  } catch (error) {
    log.warn(`Error looking up ENS details for address ${address}`, { error });
    return null;
  }
}

export async function getEnsProfileByAddress(address: `0x${string}`) {
  const publicClient = getPublicClient(1);

  const name = await publicClient.getEnsName({ address });

  if (!name) {
    return null;
  }

  return getENSDetails(name);
}
