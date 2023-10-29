"use client"
import React, { useEffect, useState } from 'react';
import styles from "../styles/Home.module.css";
import { Card, CardHeader, CardBody, CardFooter, Divider, Tab, Tabs, Input, Tooltip, Progress } from "@nextui-org/react";
import DepositCardEscrow from "../components/DepositCardEscrow";
import DepositCardSelfCustody from "../components/DepositCardSelfCustody";
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useContractReads, erc721ABI, Address, erc20ABI, useBlockNumber } from "wagmi";


const genericERC20ContractConfig = {
    abi: erc20ABI
} as const;

export default function AvatarManager(
    {
        userExpressionType,
        userExpressionVaultAddress,

    }: any) {
    const [managerVisibility, setManagerVisibility] = React.useState(false);

    useEffect(() => {
        if (userExpressionType == "None") {
            setManagerVisibility(true);
        } else {
            setManagerVisibility(false);
        }
    }, [userExpressionType]);

    return (
        <div
            className={styles.avatarManager}
            style={{ visibility: managerVisibility ? "visible" : "hidden" }}
        >
            <Tabs className={styles.tabs} aria-label="Deposit">
                <Tab key="escrow" title="Escrow">
                    <DepositCardEscrow
                        userExpressionType={userExpressionType}
                        userExpressionVaultAddress={userExpressionVaultAddress}
                    />
                </Tab>
                <Tab key="selfcustody" title="Self Custody">
                    <DepositCardSelfCustody
                        userExpressionType={userExpressionType}
                        userExpressionVaultAddress={userExpressionVaultAddress}

                    />
                </Tab>
            </Tabs>
        </div>
    );
}
