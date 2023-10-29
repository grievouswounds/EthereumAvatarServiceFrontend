"use client"
import React, { useEffect } from 'react';
import styles from "../styles/Home.module.css";
import { Card, CardHeader, CardBody, CardFooter, Divider, Tab, Tabs, Input, Tooltip, Progress, Button } from "@nextui-org/react";
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useContractReads, erc721ABI, Address, erc20ABI, useBlockNumber } from "wagmi";
import { avatarVaultABI } from '../abis/avatarVault-abi';
import writePreperations from '@/helpers/contractWritePrepares';
import { ERC721ContractConfig, ERC20ContractConfig, getAvatarVaultConfig, EACMasterConfig, EASCoinConfig, EASNFTConfig } from "../helpers/contractConfigurations"


// const vaultContractConfig = {
//     address: "0x75537828f2ce51be7289709686A69CbFDbB714F1",
//     abi: avatarVaultABI,
// } as const;

export default function SelfCustodyVault(
    {

        userExpressionVaultAddress,
        userExpressionType

    }: any) {

    useEffect(() => {
        if (userExpressionType == "Self Custody") {
            withdrawSelfCustodyPrep.refetch();
        }
    })

    const withdrawSelfCustodyPrep = usePrepareContractWrite({
        ...getAvatarVaultConfig(userExpressionVaultAddress),
        functionName: "withdrawSelfCustody",
        address: userExpressionVaultAddress as Address,
        enabled: false
    });
    const withdrawSelfCustodyWrite = useContractWrite(withdrawSelfCustodyPrep.config);


    return (
        <div>
            <Divider />
            <CardFooter>
                <Button
                    className={styles.button}
                    color="primary"
                    onClick={() => withdrawSelfCustodyWrite.write?.()}
                    data-write-loading={withdrawSelfCustodyWrite.isLoading || withdrawSelfCustodyWrite.isSuccess}
                    isLoading={withdrawSelfCustodyWrite.isSuccess}
                >
                    {!withdrawSelfCustodyWrite.isLoading && !withdrawSelfCustodyWrite.isSuccess && "Withdraw Self Custody"}
                    {withdrawSelfCustodyWrite.isLoading && "Waiting For Approval"}
                    {withdrawSelfCustodyWrite.isSuccess && "Withdrawing Self Custody..."}
                </Button>
            </CardFooter>
        </div>
    );
}
