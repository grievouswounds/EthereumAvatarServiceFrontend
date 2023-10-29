"use client"
import React, { useEffect } from 'react';
import styles from "../styles/Home.module.css";
import { Card, CardHeader, CardBody, CardFooter, Divider, Tab, Tabs, Input, Tooltip, Progress, Button } from "@nextui-org/react";
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useContractReads, erc721ABI, Address, erc20ABI, useBlockNumber } from "wagmi";
import { avatarVaultABI } from '../abis/avatarVault-abi';
import writePreperations from '@/helpers/contractWritePrepares';

export default function EscrowVault(
    {

        userExpressionVaultAddress,
        userExpressionType

    }: any) {

    useEffect(() => {
        if (userExpressionType == "Escrow") {
            withdrawEscrowPrep.refetch();
        }
    }, [userExpressionType]);

    const withdrawEscrowPrep = writePreperations.escrow.withdrawEscrow(userExpressionVaultAddress);
    const withdrawEscrowWrite = useContractWrite(withdrawEscrowPrep.config);

    return (
        <div>
            <Divider />
            <CardFooter>
                <Button
                    className={styles.button}
                    color="primary"
                    onClick={() => withdrawEscrowWrite.write?.()}
                    data-write-loading={withdrawEscrowWrite.isLoading || withdrawEscrowWrite.isSuccess}
                    isLoading={withdrawEscrowWrite.isSuccess}
                >
                    {!withdrawEscrowWrite.isLoading && !withdrawEscrowWrite.isSuccess && "Withdraw Escrow"}
                    {withdrawEscrowWrite.isLoading && "Waiting For Approval"}
                    {withdrawEscrowWrite.isSuccess && "Withdrawing Escrow..."}
                </Button>
            </CardFooter>
        </div >
    );
}
