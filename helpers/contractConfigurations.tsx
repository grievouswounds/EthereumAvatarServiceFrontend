import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useContractReads, erc721ABI, Address, erc20ABI, useBlockNumber } from "wagmi";
import { avatarVaultABI } from '../abis/avatarVault-abi';
import { EACMaster, EASCoinAddress, EASNFT } from "@/helpers/contractAddresses";
import { ethereumAvatarService } from "@/abis/EthereumAvatarService-abi";
import { easTokenABI } from "@/abis/EASToken-abi";
import { easCatsABI } from "@/abis/EASCats-abi";

export const ERC20ContractConfig = {
    abi: erc20ABI
} as const;

export const ERC721ContractConfig = {
    abi: erc721ABI
} as const;

export const EACMasterConfig = {
    address: EACMaster as Address,
    abi: ethereumAvatarService,
} as const;

export const EASCoinConfig = {
    address: EASCoinAddress,
    abi: easTokenABI
} as const;

export const EASNFTConfig = {
    address: EASNFT as Address,
    abi: easCatsABI
}

//TODO: type parameter as 0x string
export function getAvatarVaultConfig(avatarVaultAddress: string) {
    const vaultContractConfig = {
        address: avatarVaultAddress as Address,
        abi: avatarVaultABI,
    } as const;

    return vaultContractConfig
}



