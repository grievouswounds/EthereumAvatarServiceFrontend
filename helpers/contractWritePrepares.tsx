import { ERC721ContractConfig, ERC20ContractConfig, getAvatarVaultConfig, EACMasterConfig, EASCoinConfig, EASNFTConfig } from "./contractConfigurations"
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useContractReads, Address, useBlockNumber } from "wagmi";

const writePreperations = {
    generic: {
        erc721Approve: function (addressToApprove: any, idToApprove: bigint, erc721Address: string) {
            const approveERC721Prep = usePrepareContractWrite({
                ...ERC721ContractConfig,
                functionName: "approve",
                args: [addressToApprove as Address, idToApprove],
                address: erc721Address as Address,
                // enabled: false
            });

            return approveERC721Prep;

        },
        erc721Mint: function () {
            const mintERC7211Prep = usePrepareContractWrite({
                ...EASNFTConfig,
                functionName: "mint",
                enabled: true
            });

            return mintERC7211Prep;
        },
        erc20Approve: function (addressToApprove: any, amountToApprove: bigint, erc20Address: string) {
            const approveERC20Prep = usePrepareContractWrite({
                ...ERC20ContractConfig,
                functionName: "approve",
                args: [addressToApprove as Address, amountToApprove],
                address: erc20Address as Address,
                // enabled: false
            });

            return approveERC20Prep;
        },
        createAvatarVault: function () {
            const createAvatarVaultPrep = usePrepareContractWrite({
                ...EACMasterConfig,
                functionName: "createAvatarVault",

            });

            return createAvatarVaultPrep;
        }
    },
    escrow: {
        setAvatar: function (erc721Address: string, erc721ID: bigint, avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const setAvatarPrep = usePrepareContractWrite({
                ...avatarVaultConfig,
                functionName: "setAvatarWithEscrow",
                args: [erc721Address as Address, erc721ID],
                address: avatarVaultAddress as Address,
                enabled: false
            });

            return setAvatarPrep;
        },
        withdrawEscrow: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const withdrawEscrowConfig = usePrepareContractWrite({
                ...avatarVaultConfig,
                functionName: "withdrawEscrow",
                address: avatarVaultAddress as Address,
                enabled: false
            });

            return withdrawEscrowConfig;
        },
        liquidateAvatarMoved: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const { config: liquidateMovedConfig } = usePrepareContractWrite({
                ...avatarVaultConfig,
                functionName: "liquidateEscrowAvatarMoved",
                address: avatarVaultAddress as Address
            });

            return liquidateMovedConfig;
        }

    },
    selfCustody: {
        setAvatar: function (erc721Address: string, erc721ID: bigint, avatarVaultAddress: any, depositAmount: bigint) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const setAvatarPrep = usePrepareContractWrite({
                ...avatarVaultConfig,
                functionName: "setAvatarWithSelfCustody",
                args: [erc721Address as Address, erc721ID, depositAmount],
                address: avatarVaultAddress as Address,
                enabled: false
            });

            return setAvatarPrep;
        },
        withdrawSelfCustody: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const { config: withdrawSelfCustodyConfig } = usePrepareContractWrite({
                ...avatarVaultConfig,
                functionName: "setAvatarWithSelfCustody",
                address: avatarVaultAddress as Address,
                // enabled: false
            });

            return withdrawSelfCustodyConfig;
        },
        liquidateTimeOut: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const { config: liquidateTimeOutConfig } = usePrepareContractWrite({
                ...avatarVaultConfig,
                functionName: "liquidateSelfCustodyTimeOut",

            });

            return liquidateTimeOutConfig;
        },
        liquidationNewOwner: function (avatarVaultAddress: any) {
            const avatarVaultConfig = getAvatarVaultConfig(avatarVaultAddress);
            const { config: liquidateNewOwnerConfig } = usePrepareContractWrite({
                ...avatarVaultConfig,
                functionName: "liquidateSelfCustodyNewOwner"
            });

            return liquidateNewOwnerConfig;
        }
    },
    random: {
        mintFaucet: function () {
            const mintFaucetPrep = usePrepareContractWrite({
                ...EASCoinConfig,
                functionName: "faucet",
            });

            return mintFaucetPrep;
        }
    }


}

export default writePreperations;



