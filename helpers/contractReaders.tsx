import { ERC721ContractConfig, ERC20ContractConfig, getAvatarVaultConfig, EACMasterConfig } from "./contractConfigurations"
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useContractReads, erc721ABI, Address, erc20ABI, useBlockNumber } from "wagmi";

//TODO: fix "any" types
const readpreperations = {
    generic: {
        readAvatarVault: function (vaultOwner: Address) {
            const vaultKeeperConfig = EACMasterConfig;
            const { data: avatarVaultData } = useContractRead({
                ...vaultKeeperConfig,
                functionName: "getAvatarVault",
                args: [vaultOwner],
                watch: true
            });

            return avatarVaultData;
        },
        readAvatarAddress: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const { data: avatarAdressConfig } = useContractRead({
                ...avatarVaultConfig,
                functionName: "avatarAddress",
                watch: true
            });

            //TODO: return full read instead of only data
            return avatarAdressConfig;
        },
        readAvatarID: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const { data: avatarID } = useContractRead({
                ...avatarVaultConfig,
                functionName: "avatarID",
                watch: true
            });

            //TODO: return full read instead of only data
            return avatarID;
        },
        readAvatarIsActive: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const { data: vaultIsActiveConfig } = useContractRead({
                ...avatarVaultConfig,
                functionName: "vaultIsActive",
                watch: true
            });

            return vaultIsActiveConfig;
        },
        readVaultMode: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const { data: typeOfExpressionConfig } = useContractRead({
                ...avatarVaultConfig,
                functionName: "vaultMode",
                watch: true
            });

            return typeOfExpressionConfig;
        },
        readLiquidated: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const { data: liquidatedConfig } = useContractRead({
                ...avatarVaultConfig,
                functionName: "liquidated",
                watch: true
            });

            return liquidatedConfig;
        },
        readERC721Name: function (erc721Address: string) {
            const erc721NameConfig = useContractRead({
                ...ERC721ContractConfig,
                address: erc721Address as Address,
                functionName: "name",
            });

            return erc721NameConfig;
        },
        readERC721TokenURI: function (erc721Address: string, id: bigint) {
            const erc721NameConfig = useContractRead({
                ...ERC721ContractConfig,
                address: erc721Address as Address,
                functionName: "tokenURI",
                args: [id],
            });

            return erc721NameConfig;
        },
        readERC20BalanceOf: function (erc20Address: string, account: string) {
            const { data: erc20BalanceOfConfig } = useContractRead({
                ...ERC20ContractConfig,
                address: erc20Address as Address,
                functionName: "balanceOf",
                args: [account as Address],
                watch: true
            });

            return erc20BalanceOfConfig;
        }
    },
    escrow: {
        readEscrowCost: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const { data: escrowCostData } = useContractRead({
                ...avatarVaultConfig,
                functionName: "escrowCost",
                watch: true
            });

            //TODO: return full read instead of only data
            return escrowCostData;
        }

    },
    selfCustody: {
        readBlockDeadline: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const { data: selfCustodyUntillData } = useContractRead({
                ...avatarVaultConfig,
                functionName: "selfCustodyBlockDeadline",
                watch: true
            });

            //TODO: return full read instead of only data
            return selfCustodyUntillData;
        }
    }


}

export default readpreperations;



